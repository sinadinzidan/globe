import { ApiProperty } from '@nestjs/swagger';
import type { WorkOrder } from '../entities/work-order.entity.js';
import { WorkOrderStatus } from '../enums/work-order-status.enum.js';
import { WorkOrderType } from '../enums/work-order-type.enum.js';

export class WorkOrderDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'WO-512345' })
  number: string;

  @ApiProperty({ example: 'Calibrate instruments' })
  title: string;

  @ApiProperty({ enum: WorkOrderType, enumName: 'WorkOrderType' })
  type: WorkOrderType;

  @ApiProperty({ enum: WorkOrderStatus, enumName: 'WorkOrderStatus' })
  status: WorkOrderStatus;

  @ApiProperty({ format: 'date', nullable: true, type: String, example: '2026-12-01' })
  dueDate: string | null;

  @ApiProperty({ format: 'date-time', nullable: true, type: String })
  completedAt: Date | null;

  @ApiProperty({
    description: 'Who raised it. Empty for imported work orders.',
    nullable: true,
    type: String,
  })
  createdByName: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: 'Whether you may change this work order.' })
  canUpdate: boolean;

  static from(workOrder: WorkOrder, canUpdate: boolean): WorkOrderDto {
    return {
      id: workOrder.id,
      number: workOrder.number,
      title: workOrder.title,
      type: workOrder.type,
      status: workOrder.status,
      dueDate: workOrder.dueDate,
      completedAt: workOrder.completedAt,
      createdByName: workOrder.createdBy?.fullName ?? null,
      createdAt: workOrder.createdAt,
      canUpdate,
    };
  }
}
