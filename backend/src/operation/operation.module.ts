import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../asset/entities/asset.entity.js';
import { PlantModule } from '../plant/plant.module.js';
import { WorkOrder } from '../work-order/entities/work-order.entity.js';
import { OperationController } from './operation.controller.js';
import { OperationService } from './operation.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, WorkOrder]), PlantModule],
  controllers: [OperationController],
  providers: [OperationService],
})
export class OperationModule {}
