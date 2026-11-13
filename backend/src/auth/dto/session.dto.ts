import { ApiProperty } from '@nestjs/swagger';
import type { AuthSession } from '../entities/auth-session.entity.js';

/** One place the user is signed in. */
export class SessionDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'The browser or device, as it identified itself.',
    nullable: true,
    type: String,
  })
  userAgent: string | null;

  @ApiProperty({
    description: 'The network address the session was started from.',
    nullable: true,
    type: String,
  })
  ipAddress: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: 'When the session ends at the latest.', format: 'date-time' })
  expiresAt: Date;

  @ApiProperty({ description: 'Whether this is the session the request was made with.' })
  isCurrent: boolean;

  static from(session: AuthSession, currentSessionId: string): SessionDto {
    return {
      id: session.id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      isCurrent: session.id === currentSessionId,
    };
  }
}
