import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { AuthorizationService } from '@nestjs/authorization';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { AssetService } from '../asset/asset.service.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { canAccessPlant } from '../common/utilities/permission.utility.js';
import {
  UNIQUE_VIOLATION_CODE,
  WORK_ORDER_MESSAGE,
  WORK_ORDER_NUMBER_ATTEMPTS,
} from './constants/work-order.constant.js';
import type { CreateWorkOrderDto } from './dto/create-work-order.dto.js';
import type { UpdateWorkOrderDto } from './dto/update-work-order.dto.js';
import { WorkOrderDto } from './dto/work-order.dto.js';
import { WorkOrder } from './entities/work-order.entity.js';
import { WorkOrderStatus } from './enums/work-order-status.enum.js';
import { generateWorkOrderNumber } from './utilities/work-order-number.utility.js';
import { WorkOrderPolicy } from './work-order.policy.js';

@Injectable()
export class WorkOrderService {
  constructor(
    @InjectRepository(WorkOrder) private readonly workOrderRepository: Repository<WorkOrder>,
    private readonly assetService: AssetService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async listForAsset(user: AuthenticatedUser, plantId: string, assetCode: string) {
    const asset = await this.assetService.loadAccessible(user, plantId, assetCode);
    const workOrders = await this.workOrderRepository.find({
      where: { assetId: asset.id },
      relations: { createdBy: true },
      order: { createdAt: 'DESC' },
    });
    return Promise.all(workOrders.map((workOrder) => this.toDto(user, workOrder)));
  }

  async create(
    user: AuthenticatedUser,
    plantId: string,
    assetCode: string,
    input: CreateWorkOrderDto,
  ) {
    const asset = await this.assetService.loadAccessible(user, plantId, assetCode);
    const workOrder = await this.insertWithUniqueNumber({
      assetId: asset.id,
      title: input.title.trim(),
      type: input.type,
      dueDate: input.dueDate ?? null,
      createdById: user.id,
    });
    return this.toDto(user, await this.loadWithCreator(workOrder.id));
  }

  /**
   * Changes a work order. The user must reach the plant it belongs to, and must either hold
   * the permission to change any work order or have raised this one.
   */
  async update(user: AuthenticatedUser, workOrderId: string, changes: UpdateWorkOrderDto) {
    const workOrder = await this.loadAccessible(user, workOrderId);
    await this.authorizationService.authorize(WorkOrderPolicy, 'update', user, workOrder);
    Object.assign(workOrder, {
      ...(changes.title !== undefined && { title: changes.title.trim() }),
      ...(changes.dueDate !== undefined && { dueDate: changes.dueDate }),
      ...(changes.status !== undefined && this.toStatusChange(workOrder, changes.status)),
    });
    await this.workOrderRepository.save(workOrder);
    return this.toDto(user, workOrder);
  }

  /** The work order, if it exists in a plant the user may reach. Otherwise: not found. */
  private async loadAccessible(user: AuthenticatedUser, workOrderId: string) {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id: workOrderId },
      relations: { asset: true, createdBy: true },
    });
    if (!workOrder || !canAccessPlant(user, workOrder.asset.plantId)) {
      throw new NotFoundException(WORK_ORDER_MESSAGE.NOT_FOUND);
    }
    return workOrder;
  }

  private async loadWithCreator(workOrderId: string) {
    return this.workOrderRepository.findOneOrFail({
      where: { id: workOrderId },
      relations: { createdBy: true },
    });
  }

  /** Completing a work order stamps the time. Reopening it clears the stamp. */
  private toStatusChange(workOrder: WorkOrder, status: WorkOrderStatus) {
    const isCompleting = status === WorkOrderStatus.COMPLETED;
    const completedAt = isCompleting ? (workOrder.completedAt ?? new Date()) : null;
    return { status, completedAt };
  }

  /** Inserts with a generated number, trying another when the database reports it is taken. */
  private async insertWithUniqueNumber(values: Partial<WorkOrder>) {
    for (let attempt = 0; attempt < WORK_ORDER_NUMBER_ATTEMPTS; attempt += 1) {
      try {
        return await this.workOrderRepository.save(
          this.workOrderRepository.create({ ...values, number: generateWorkOrderNumber() }),
        );
      } catch (error) {
        if (!this.isUniqueViolation(error)) {
          throw error;
        }
      }
    }
    throw new ServiceUnavailableException(WORK_ORDER_MESSAGE.NUMBER_UNAVAILABLE);
  }

  private isUniqueViolation(error: unknown) {
    return (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string }).code === UNIQUE_VIOLATION_CODE
    );
  }

  private async toDto(user: AuthenticatedUser, workOrder: WorkOrder) {
    return WorkOrderDto.from(
      workOrder,
      await this.authorizationService.can(WorkOrderPolicy, 'update', user, workOrder),
    );
  }
}
