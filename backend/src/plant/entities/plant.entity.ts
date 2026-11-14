import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Emirate } from '../enums/emirate.enum.js';
import { PlantModel } from '../enums/plant-model.enum.js';
import { PlantStatus } from '../enums/plant-status.enum.js';
import { PlantSector } from '../enums/plant-sector.enum.js';
import type { SceneryBuilding } from '../types/scenery-building.type.js';

export const PLANT_ID_LENGTH = 64;

@Entity()
export class Plant {
  /** A readable identifier, used in URLs, such as `ruwais-refinery`. */
  @PrimaryColumn({ type: 'varchar', length: PLANT_ID_LENGTH })
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  operator: string;

  @Column({ type: 'enum', enum: PlantSector })
  sector: PlantSector;

  @Column({ type: 'enum', enum: Emirate })
  emirate: Emirate;

  @Column({ type: 'double precision' })
  longitude: number;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: PlantModel })
  model: PlantModel;

  @Column({ type: 'enum', enum: PlantStatus, default: PlantStatus.OPERATING })
  status: PlantStatus;

  /** Buildings that fill out the 3D model. Their shape is free-form drawing data. */
  @Column({ type: 'jsonb', default: () => "'[]'" })
  scenery: SceneryBuilding[];
}
