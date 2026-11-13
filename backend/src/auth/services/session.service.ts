import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '@nestjs/authentication';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import type { Environment } from '../../common/config/environment.js';
import { MILLISECONDS_PER_DAY } from '../../common/constants/throttle.constant.js';
import { AUTH_MESSAGE, SESSION_CLAIM, SIGN_IN_METHOD } from '../constants/auth.constant.js';
import { AuthSession } from '../entities/auth-session.entity.js';
import { RefreshToken } from '../entities/refresh-token.entity.js';
import type { ClientDetails } from '../types/client-details.type.js';

/** Starts, lists and ends sessions. A session is one sign-in on one device. */
@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(AuthSession) private readonly sessionRepository: Repository<AuthSession>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<Environment, true>,
  ) {}

  /** Records a new session and issues its first access and refresh tokens. */
  async start(userId: string, client: ClientDetails) {
    const sessionId = randomUUID();
    const lifetime =
      this.configService.get('SESSION_TTL_DAYS', { infer: true }) * MILLISECONDS_PER_DAY;
    await this.sessionRepository.insert({
      id: sessionId,
      userId,
      userAgent: client.userAgent,
      ipAddress: client.ipAddress,
      expiresAt: new Date(Date.now() + lifetime),
    });
    return this.tokenService.issue(userId, {
      claims: { [SESSION_CLAIM]: sessionId },
      method: SIGN_IN_METHOD,
    });
  }

  /** Exchanges a refresh token for a new pair. A reused token revokes the whole session. */
  rotate(refreshToken: string) {
    return this.tokenService.refresh(refreshToken);
  }

  /** The session if it can still be used. */
  findActive(sessionId: string) {
    return this.sessionRepository.findOneBy({
      id: sessionId,
      revokedAt: IsNull(),
      expiresAt: MoreThan(new Date()),
    });
  }

  listForUser(userId: string) {
    return this.sessionRepository.find({
      where: { userId, revokedAt: IsNull(), expiresAt: MoreThan(new Date()) },
      order: { createdAt: 'DESC' },
    });
  }

  /** Ends one of the user's own sessions. Someone else's session is reported as not found. */
  async endOwned(userId: string, sessionId: string) {
    const session = await this.sessionRepository.findOneBy({ id: sessionId, userId });
    if (!session) {
      throw new NotFoundException(AUTH_MESSAGE.SESSION_NOT_FOUND);
    }
    await this.end(sessionId);
  }

  /** Ends a session: its refresh tokens stop working, and so do access tokens that name it. */
  async end(sessionId: string) {
    await this.refreshTokenRepository.update({ sessionId }, { isRevoked: true });
    await this.sessionRepository.update(
      { id: sessionId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  /** Ends every session of a user, on every device. */
  endAllForUser(userId: string) {
    return this.tokenService.revokeAll(userId);
  }
}
