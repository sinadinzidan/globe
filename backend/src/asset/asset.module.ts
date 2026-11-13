import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantModule } from '../plant/plant.module.js';
import { AssetController } from './asset.controller.js';
import { AssetPolicy } from './asset.policy.js';
import { AssetService } from './asset.service.js';
import { Asset } from './entities/asset.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), PlantModule],
  controllers: [AssetController],
  providers: [AssetService, AssetPolicy],
  exports: [AssetService],
})
export class AssetModule {}
