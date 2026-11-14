import { ApiProperty } from '@nestjs/swagger';
import type { Plant } from '../entities/plant.entity.js';
import { Emirate } from '../enums/emirate.enum.js';
import { PlantModel } from '../enums/plant-model.enum.js';
import { PlantStatus } from '../enums/plant-status.enum.js';
import { PlantSector } from '../enums/plant-sector.enum.js';

export class PlantDto {
  @ApiProperty({ description: 'A readable identifier, used in URLs.', example: 'ruwais-refinery' })
  id: string;

  @ApiProperty({ example: 'Ruwais Refinery' })
  name: string;

  @ApiProperty({ example: 'ADNOC Refining' })
  operator: string;

  @ApiProperty({ enum: PlantSector, enumName: 'PlantSector' })
  sector: PlantSector;

  @ApiProperty({ enum: Emirate, enumName: 'Emirate' })
  emirate: Emirate;

  @ApiProperty({ example: 52.73 })
  longitude: number;

  @ApiProperty({ example: 24.11 })
  latitude: number;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: PlantModel, enumName: 'PlantModel' })
  model: PlantModel;

  @ApiProperty({ enum: PlantStatus, enumName: 'PlantStatus' })
  status: PlantStatus;

  static from(plant: Plant): PlantDto {
    return {
      id: plant.id,
      name: plant.name,
      operator: plant.operator,
      sector: plant.sector,
      emirate: plant.emirate,
      longitude: plant.longitude,
      latitude: plant.latitude,
      description: plant.description,
      model: plant.model,
      status: plant.status,
    };
  }
}
