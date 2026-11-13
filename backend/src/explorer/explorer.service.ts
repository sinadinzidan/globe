import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AssetService } from '../asset/asset.service.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { PlantService } from '../plant/plant.service.js';
import { ASSET_KEY_SEPARATOR, LEADERBOARD_SIZE } from './constants/explorer.constant.js';
import type { ExplorerProgressDto, LeaderboardEntryDto } from './dto/explorer.dto.js';
import { ExplorerProgress } from './entities/explorer-progress.entity.js';
import type { ExplorablePlant, ExplorationRecord } from './types/explorer.type.js';
import {
  countUnlocked,
  evaluateAchievements,
  toAssetKey,
  toStanding,
} from './utilities/explorer-rules.utility.js';

const EMPTY_RECORD: ExplorationRecord = {
  discoveredPlantIds: [],
  inspectedAssetKeys: [],
  hasOpenedGlobe: false,
};

type RecordChange = (record: ExplorationRecord) => ExplorationRecord;

@Injectable()
export class ExplorerService {
  constructor(
    @InjectRepository(ExplorerProgress)
    private readonly progressRepository: Repository<ExplorerProgress>,
    private readonly dataSource: DataSource,
    private readonly plantService: PlantService,
    private readonly assetService: AssetService,
  ) {}

  async getProgress(user: AuthenticatedUser) {
    const record = (await this.progressRepository.findOneBy({ userId: user.id })) ?? EMPTY_RECORD;
    return this.toDto(await this.loadExplorablePlants(user), record);
  }

  /** Records that the user opened a plant. Only a plant they can reach can be discovered. */
  async discoverPlant(user: AuthenticatedUser, plantId: string) {
    await this.plantService.loadAccessible(user, plantId);
    return this.change(user, (record) => this.withPlant(record, plantId));
  }

  /** Records that the user opened an asset, which also discovers its plant. */
  async inspectAsset(user: AuthenticatedUser, plantId: string, assetCode: string) {
    await this.assetService.loadAccessible(user, plantId, assetCode);
    const key = toAssetKey(plantId, assetCode);
    return this.change(user, (record) => ({
      ...this.withPlant(record, plantId),
      inspectedAssetKeys: record.inspectedAssetKeys.includes(key)
        ? record.inspectedAssetKeys
        : [...record.inspectedAssetKeys, key],
    }));
  }

  markGlobeOpened(user: AuthenticatedUser) {
    return this.change(user, (record) => ({ ...record, hasOpenedGlobe: true }));
  }

  reset(user: AuthenticatedUser) {
    return this.change(user, () => EMPTY_RECORD);
  }

  /** The explorers with the most achievements. Only names and standing are shown. */
  async getLeaderboard(user: AuthenticatedUser): Promise<LeaderboardEntryDto[]> {
    const rows = await this.progressRepository
      .createQueryBuilder('progress')
      .innerJoinAndSelect('progress.user', 'user')
      .where('progress.unlockedAchievementCount > 0')
      .andWhere('user.isActive = true')
      .orderBy('progress.unlockedAchievementCount', 'DESC')
      .addOrderBy('progress.updatedAt', 'ASC')
      .take(LEADERBOARD_SIZE)
      .getMany();
    return rows.map((row, index) => ({
      position: index + 1,
      fullName: row.user.fullName,
      unlockedCount: row.unlockedAchievementCount,
      isCurrentUser: row.userId === user.id,
    }));
  }

  /**
   * Applies a change to the user's record. The row is locked for the length of the transaction,
   * so two discoveries made at the same moment cannot overwrite each other.
   */
  private async change(user: AuthenticatedUser, applyChange: RecordChange) {
    const plants = await this.loadExplorablePlants(user);
    const record = await this.dataSource.transaction(async (manager) => {
      await manager.upsert(
        ExplorerProgress,
        { userId: user.id },
        { conflictPaths: ['userId'], skipUpdateIfNoValuesChanged: true },
      );
      const current = await manager.findOneOrFail(ExplorerProgress, {
        where: { userId: user.id },
        lock: { mode: 'pessimistic_write' },
      });
      const next = applyChange(current);
      await manager.update(
        ExplorerProgress,
        { userId: user.id },
        { ...next, unlockedAchievementCount: countUnlocked(plants, next) },
      );
      return next;
    });
    return this.toDto(plants, record);
  }

  private withPlant(record: ExplorationRecord, plantId: string): ExplorationRecord {
    return {
      discoveredPlantIds: record.discoveredPlantIds.includes(plantId)
        ? record.discoveredPlantIds
        : [...record.discoveredPlantIds, plantId],
      inspectedAssetKeys: record.inspectedAssetKeys,
      hasOpenedGlobe: record.hasOpenedGlobe,
    };
  }

  private async loadExplorablePlants(user: AuthenticatedUser): Promise<ExplorablePlant[]> {
    const plants = await this.plantService.listAccessible(user);
    const assetCounts = await this.assetService.countByPlant(plants.map((plant) => plant.id));
    return plants.map((plant) => ({
      id: plant.id,
      operator: plant.operator,
      sector: plant.sector,
      model: plant.model,
      assetCount: assetCounts.get(plant.id) ?? 0,
    }));
  }

  private toDto(plants: ExplorablePlant[], record: ExplorationRecord): ExplorerProgressDto {
    const reachableIds = new Set(plants.map((plant) => plant.id));
    const achievements = evaluateAchievements(plants, record);
    const unlockedCount = achievements.filter((achievement) => achievement.isUnlocked).length;
    const inspectedAssetKeys = record.inspectedAssetKeys.filter((key) =>
      reachableIds.has(key.split(ASSET_KEY_SEPARATOR)[0] ?? ''),
    );
    const discoveredPlantIds = record.discoveredPlantIds.filter((plantId) =>
      reachableIds.has(plantId),
    );
    return {
      discoveredPlantIds,
      inspectedAssetKeys,
      hasOpenedGlobe: record.hasOpenedGlobe,
      discoveredCount: discoveredPlantIds.length,
      totalCount: plants.length,
      inspectedCount: inspectedAssetKeys.length,
      assetCount: plants.reduce((total, plant) => total + plant.assetCount, 0),
      achievements,
      unlockedCount,
      ...toStanding(unlockedCount, achievements.length),
    };
  }
}
