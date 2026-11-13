import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity.js';

const EMPTY_ARRAY_DEFAULT = "'{}'";

/** What a user has explored so far. One row per user, created on their first discovery. */
@Entity()
export class ExplorerProgress {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', array: true, default: () => EMPTY_ARRAY_DEFAULT })
  discoveredPlantIds: string[];

  /** Inspected assets, each as `plantId/assetCode`. */
  @Column({ type: 'varchar', array: true, default: () => EMPTY_ARRAY_DEFAULT })
  inspectedAssetKeys: string[];

  @Column({ type: 'boolean', default: false })
  hasOpenedGlobe: boolean;

  /** Kept up to date on every change, so the leaderboard can be read without recalculating. */
  @Index()
  @Column({ type: 'integer', default: 0 })
  experience: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
