import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { WORK_ORDER_TITLE_MAXIMUM_LENGTH } from '../entities/work-order.entity.js';
import { WorkOrderType } from '../enums/work-order-type.enum.js';

export class CreateWorkOrderDto {
  @ApiProperty({ example: 'Replace worn components', maxLength: WORK_ORDER_TITLE_MAXIMUM_LENGTH })
  @IsString()
  @MinLength(1)
  @MaxLength(WORK_ORDER_TITLE_MAXIMUM_LENGTH)
  title: string;

  @ApiProperty({ enum: WorkOrderType, enumName: 'WorkOrderType' })
  @IsEnum(WorkOrderType)
  type: WorkOrderType;

  @ApiPropertyOptional({ format: 'date', example: '2026-12-01' })
  @IsDateString({ strict: true })
  @IsOptional()
  dueDate?: string;
}
