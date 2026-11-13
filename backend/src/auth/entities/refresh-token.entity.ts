import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity.js';
import { AuthSession } from './auth-session.entity.js';

/**
 * A refresh token as `@nestjs/authentication` stores it. Only the SHA-256 hash of the token is
 * kept, as the primary key, so a copy of this table cannot be replayed.
 */
@Entity()
export class RefreshToken {
  @PrimaryColumn({ type: 'varchar', length: 128 })
  id: string;

  /** Every rotation of one sign-in shares a family. */
  @Index()
  @Column({ type: 'varchar', length: 128 })
  familyId: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  /** The session the family belongs to, taken from the token's claims. */
  @Index()
  @Column({ type: 'uuid', nullable: true })
  sessionId: string | null;

  @ManyToOne(() => AuthSession, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  session: AuthSession | null;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Index()
  @Column({ type: 'timestamptz' })
  familyExpiresAt: Date;

  /** Set once, when the token is exchanged. A second use means it was stolen. */
  @Column({ type: 'timestamptz', nullable: true })
  usedAt: Date | null;

  /** Claims fixed at sign-in that every access token of the family carries. */
  @Column({ type: 'jsonb', nullable: true })
  claims: object | null;

  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;
}
