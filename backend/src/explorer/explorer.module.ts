import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetModule } from '../asset/asset.module.js';
import { PlantModule } from '../plant/plant.module.js';
import { ExplorerProgress } from './entities/explorer-progress.entity.js';
import { ExplorerController } from './explorer.controller.js';
import { ExplorerService } from './explorer.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ExplorerProgress]), PlantModule, AssetModule],
  controllers: [ExplorerController],
  providers: [ExplorerService],
})
export class ExplorerModule {}
