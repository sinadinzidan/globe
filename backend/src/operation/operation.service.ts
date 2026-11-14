import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Asset } from '../asset/entities/asset.entity.js';
import { AssetStatus } from '../asset/enums/asset-status.enum.js';
import { Permission } from '../common/enums/permission.enum.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { hasPermission } from '../common/utilities/permission.utility.js';
import type { Plant } from '../plant/entities/plant.entity.js';
import { PlantSector } from '../plant/enums/plant-sector.enum.js';
import { PlantStatus } from '../plant/enums/plant-status.enum.js';
import { PlantService } from '../plant/plant.service.js';
import { WorkOrder } from '../work-order/entities/work-order.entity.js';
import { WorkOrderStatus } from '../work-order/enums/work-order-status.enum.js';
import type {
  AttentionItemDto,
  OperationSummaryDto,
  StreamSummaryDto,
} from './dto/operation-summary.dto.js';
import { ATTENTION_LIST_SIZE } from './operation.constant.js';

interface AssetStatusCount {
  plantId: string;
  status: AssetStatus;
  count: string;
}

@Injectable()
export class OperationService {
  constructor(
    @InjectRepository(Asset) private readonly assetRepository: Repository<Asset>,
    @InjectRepository(WorkOrder) private readonly workOrderRepository: Repository<WorkOrder>,
    private readonly plantService: PlantService,
  ) {}

  /** The state of operations across the sites the user can reach, stream by stream. */
  async getSummary(user: AuthenticatedUser): Promise<OperationSummaryDto> {
    const plants = await this.plantService.listAccessible(user);
    const plantIds = plants.map((plant) => plant.id);
    const canSeeWorkOrders = hasPermission(user, Permission.WORK_ORDER_READ);
    const [assetCounts, openWorkOrders, attention] = await Promise.all([
      this.countAssetsByStatus(plantIds),
      canSeeWorkOrders ? this.countOpenWorkOrders(plantIds) : new Map<string, number>(),
      this.listAttention(plants),
    ]);
    return {
      streams: Object.values(PlantSector).map((sector) =>
        this.summariseStream(
          sector,
          plants.filter((plant) => plant.sector === sector),
          assetCounts,
          openWorkOrders,
        ),
      ),
      attention,
      hasWorkOrderCounts: canSeeWorkOrders,
    };
  }

  private summariseStream(
    sector: PlantSector,
    plants: Plant[],
    assetCounts: AssetStatusCount[],
    openWorkOrders: Map<string, number>,
  ): StreamSummaryDto {
    const plantIds = new Set(plants.map((plant) => plant.id));
    const countWithStatus = (status?: AssetStatus) =>
      assetCounts
        .filter(
          (row) => plantIds.has(row.plantId) && (status === undefined || row.status === status),
        )
        .reduce((total, row) => total + Number(row.count), 0);
    return {
      sector,
      plantCount: plants.length,
      operatingPlantCount: plants.filter((plant) => plant.status === PlantStatus.OPERATING).length,
      assetCount: countWithStatus(),
      runningAssetCount: countWithStatus(AssetStatus.RUNNING),
      standbyAssetCount: countWithStatus(AssetStatus.STANDBY),
      maintenanceAssetCount: countWithStatus(AssetStatus.UNDER_MAINTENANCE),
      openWorkOrderCount: plants.reduce(
        (total, plant) => total + (openWorkOrders.get(plant.id) ?? 0),
        0,
      ),
    };
  }

  private countAssetsByStatus(plantIds: string[]) {
    if (plantIds.length === 0) {
      return Promise.resolve<AssetStatusCount[]>([]);
    }
    return this.assetRepository
      .createQueryBuilder('asset')
      .select('asset.plantId', 'plantId')
      .addSelect('asset.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('asset.plantId IN (:...plantIds)', { plantIds })
      .groupBy('asset.plantId')
      .addGroupBy('asset.status')
      .getRawMany<AssetStatusCount>();
  }

  private async countOpenWorkOrders(plantIds: string[]) {
    if (plantIds.length === 0) {
      return new Map<string, number>();
    }
    const rows = await this.workOrderRepository
      .createQueryBuilder('workOrder')
      .innerJoin('workOrder.asset', 'asset')
      .select('asset.plantId', 'plantId')
      .addSelect('COUNT(*)', 'count')
      .where('asset.plantId IN (:...plantIds)', { plantIds })
      .andWhere('workOrder.status != :completed', { completed: WorkOrderStatus.COMPLETED })
      .groupBy('asset.plantId')
      .getRawMany<{ plantId: string; count: string }>();
    return new Map(rows.map((row) => [row.plantId, Number(row.count)]));
  }

  private async listAttention(plants: Plant[]): Promise<AttentionItemDto[]> {
    if (plants.length === 0) {
      return [];
    }
    const assets = await this.assetRepository.find({
      where: { plantId: In(plants.map((plant) => plant.id)), status: Not(AssetStatus.RUNNING) },
      select: {
        id: true,
        plantId: true,
        code: true,
        tag: true,
        name: true,
        status: true,
        criticality: true,
      },
      order: { status: 'DESC', criticality: 'ASC', tag: 'ASC' },
      take: ATTENTION_LIST_SIZE,
    });
    return assets.flatMap((asset) => {
      const plant = plants.find((candidate) => candidate.id === asset.plantId);
      return plant
        ? [
            {
              plantId: plant.id,
              plantName: plant.name,
              sector: plant.sector,
              assetId: asset.code,
              tag: asset.tag,
              name: asset.name,
              status: asset.status,
            },
          ]
        : [];
    });
  }
}
