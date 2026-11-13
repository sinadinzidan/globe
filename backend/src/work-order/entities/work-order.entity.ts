import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Asset } from '../../asset/entities/asset.entity.js';
import { User } from '../../user/entities/user.entity.js';
import { WorkOrderStatus } from '../enums/work-order-status.enum.js';
import { WorkOrderType } from '../enums/work-order-type.enum.js';

export const WORK_ORDER_TITLE_MAXIMUM_LENGTH = 200;

@Entity()
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** The number people quote, such as `WO-412345`. */
  @Column({ type: 'varchar', length: 32, unique: true })
  number: string;

  @Index()
  @Column({ type: 'uuid' })
  assetId: string;

  @ManyToOne(() => Asset, { onDelete: 'CASCADE' })
  @JoinColumn()
  asset: Asset;

  @Column({ type: 'varchar', length: WORK_ORDER_TITLE_MAXIMUM_LENGTH })
  title: string;

  @Column({ type: 'enum', enum: WorkOrderType })
  type: WorkOrderType;

  @Index()
  @Column({ type: 'enum', enum: WorkOrderStatus, default: WorkOrderStatus.OPEN })
  status: WorkOrderStatus;

  @Column({ type: 'date', nullable: true })
  dueDate: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  /** Who raised it. Empty for work orders that came with the imported sample data. */
  @Index()
  @Column({ type: 'uuid', nullable: true })
  createdById: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  createdBy: User | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
