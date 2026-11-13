import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from './entities/plant.entity.js';
import { PlantController } from './plant.controller.js';
import { PlantPolicy } from './plant.policy.js';
import { PlantService } from './plant.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Plant])],
  controllers: [PlantController],
  providers: [PlantService, PlantPolicy],
  exports: [PlantService],
})
export class PlantModule {}
