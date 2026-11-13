import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { WORK_ORDER_TITLE_MAXIMUM_LENGTH } from '../entities/work-order.entity.js';
import { WorkOrderStatus } from '../enums/work-order-status.enum.js';

/** Any subset of what may be changed on a work order. */
export class UpdateWorkOrderDto {
  @ApiPropertyOptional({ maxLength: WORK_ORDER_TITLE_MAXIMUM_LENGTH })
  @IsString()
  @MinLength(1)
  @MaxLength(WORK_ORDER_TITLE_MAXIMUM_LENGTH)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ enum: WorkOrderStatus, enumName: 'WorkOrderStatus' })
  @IsEnum(WorkOrderStatus)
  @IsOptional()
  status?: WorkOrderStatus;

  @ApiPropertyOptional({
    format: 'date',
    nullable: true,
    type: String,
    description: 'Send null to clear it.',
  })
  @ValidateIf((_object, value) => value !== null && value !== undefined)
  @IsDateString({ strict: true })
  dueDate?: string | null;
}
