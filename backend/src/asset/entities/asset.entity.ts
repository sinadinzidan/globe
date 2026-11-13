import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity.js';
import { AssetCriticality } from '../enums/asset-criticality.enum.js';
import { AssetStatus } from '../enums/asset-status.enum.js';
import { AssetType } from '../enums/asset-type.enum.js';
import type {
  AssetConnection,
  AssetDocument,
  AssetIndicator,
  AssetInspection,
  AssetTrend,
  LabelledValue,
} from '../types/asset-detail.type.js';

const EMPTY_LIST_DEFAULT = "'[]'";

/**
 * An asset of a plant. Specifications, readings, inspections, documents and connections are
 * illustrative samples whose shape varies by asset type, so they are kept as JSON documents.
 */
@Entity()
@Unique(['plantId', 'code'])
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 64 })
  plantId: string;

  @ManyToOne(() => Plant, { onDelete: 'CASCADE' })
  @JoinColumn()
  plant: Plant;

  /** Identifies the asset inside its plant, and in URLs, such as `c-101`. */
  @Column({ type: 'varchar', length: 32 })
  code: string;

  @Column({ type: 'varchar', length: 32 })
  tag: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'enum', enum: AssetType })
  type: AssetType;

  @Column({ type: 'varchar', length: 120 })
  area: string;

  @Column({ type: 'enum', enum: AssetStatus })
  status: AssetStatus;

  @Column({ type: 'enum', enum: AssetCriticality })
  criticality: AssetCriticality;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'double precision' })
  positionEast: number;

  @Column({ type: 'double precision' })
  positionSouth: number;

  @Column({ type: 'double precision', default: 0 })
  rotation: number;

  @Column({ type: 'double precision', default: 1 })
  scale: number;

  @Column({ type: 'jsonb', default: () => EMPTY_LIST_DEFAULT })
  specifications: LabelledValue[];

  @Column({ type: 'jsonb', default: () => EMPTY_LIST_DEFAULT })
  indicators: AssetIndicator[];

  @Column({ type: 'jsonb', default: () => EMPTY_LIST_DEFAULT })
  trends: AssetTrend[];

  @Column({ type: 'jsonb', default: () => EMPTY_LIST_DEFAULT })
  inspections: AssetInspection[];

  @Column({ type: 'jsonb', default: () => EMPTY_LIST_DEFAULT })
  documents: AssetDocument[];

  @Column({ type: 'jsonb', default: () => EMPTY_LIST_DEFAULT })
  connections: AssetConnection[];
}
