import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetModule } from '../asset/asset.module.js';
import { WorkOrder } from './entities/work-order.entity.js';
import { WorkOrderController } from './work-order.controller.js';
import { WorkOrderPolicy } from './work-order.policy.js';
import { WorkOrderService } from './work-order.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder]), AssetModule],
  controllers: [WorkOrderController],
  providers: [WorkOrderService, WorkOrderPolicy],
})
export class WorkOrderModule {}
