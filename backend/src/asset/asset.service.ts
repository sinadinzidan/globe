import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERROR_MESSAGE } from '../common/constants/api.constant.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { PlantService } from '../plant/plant.service.js';
import { AssetDetailDto, AssetSummaryDto, type PlantLayoutDto } from './dto/asset.dto.js';
import { Asset } from './entities/asset.entity.js';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset) private readonly assetRepository: Repository<Asset>,
    private readonly plantService: PlantService,
  ) {}

  /** The buildings and assets of a plant the user may see. */
  async getLayout(user: AuthenticatedUser, plantId: string): Promise<PlantLayoutDto> {
    const plant = await this.plantService.loadAccessible(user, plantId);
    const assets = await this.assetRepository.find({
      where: { plantId },
      order: { tag: 'ASC' },
      select: {
        id: true,
        code: true,
        tag: true,
        name: true,
        type: true,
        area: true,
        status: true,
        criticality: true,
        description: true,
        positionEast: true,
        positionSouth: true,
        rotation: true,
        scale: true,
        indicators: true,
        connections: true,
      },
    });
    return { scenery: plant.scenery, assets: assets.map((asset) => AssetSummaryDto.from(asset)) };
  }

  async findOne(user: AuthenticatedUser, plantId: string, assetCode: string) {
    return AssetDetailDto.from(await this.loadAccessible(user, plantId, assetCode));
  }

  async getTrends(user: AuthenticatedUser, plantId: string, assetCode: string) {
    return (await this.loadAccessible(user, plantId, assetCode)).trends;
  }

  async getInspections(user: AuthenticatedUser, plantId: string, assetCode: string) {
    return (await this.loadAccessible(user, plantId, assetCode)).inspections;
  }

  async getDocuments(user: AuthenticatedUser, plantId: string, assetCode: string) {
    return (await this.loadAccessible(user, plantId, assetCode)).documents;
  }

  /** How many assets each of the given plants has. */
  async countByPlant(plantIds: string[]) {
    if (plantIds.length === 0) {
      return new Map<string, number>();
    }
    const rows = await this.assetRepository
      .createQueryBuilder('asset')
      .select('asset.plantId', 'plantId')
      .addSelect('COUNT(*)', 'count')
      .where('asset.plantId IN (:...plantIds)', { plantIds })
      .groupBy('asset.plantId')
      .getRawMany<{ plantId: string; count: string }>();
    return new Map(rows.map((row) => [row.plantId, Number(row.count)]));
  }

  /** The asset, once the user's access to its plant has been checked. */
  async loadAccessible(user: AuthenticatedUser, plantId: string, assetCode: string) {
    await this.plantService.loadAccessible(user, plantId);
    const asset = await this.assetRepository.findOneBy({ plantId, code: assetCode });
    if (!asset) {
      throw new NotFoundException(ERROR_MESSAGE.NOT_FOUND);
    }
    return asset;
  }
}
