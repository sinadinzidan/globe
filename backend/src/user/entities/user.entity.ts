import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum.js';
import { Plant } from '../../plant/entities/plant.entity.js';

export const EMAIL_MAXIMUM_LENGTH = 320;
export const FULL_NAME_MAXIMUM_LENGTH = 200;

/** `user` is a reserved word in PostgreSQL. TypeORM quotes it; hand-written SQL must too. */
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Stored trimmed and in lower case. */
  @Column({ type: 'varchar', length: EMAIL_MAXIMUM_LENGTH, unique: true })
  email: string;

  @Column({ type: 'varchar', length: FULL_NAME_MAXIMUM_LENGTH })
  fullName: string;

  /** An Argon2id hash. Never selected unless a query asks for it by name. */
  @Column({ type: 'text', select: false })
  passwordHash: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /** Wrong passwords in a row. Reset by a successful sign-in. */
  @Column({ type: 'integer', default: 0 })
  failedLoginCount: number;

  /** Sign-in is refused until this time after too many wrong passwords. */
  @Column({ type: 'timestamptz', nullable: true })
  lockedUntil: Date | null;

  /** The plants the user is assigned to. Roles that see every plant ignore it. */
  @ManyToMany(() => Plant)
  @JoinTable()
  plants: Plant[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
