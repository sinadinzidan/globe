import { Injectable } from '@nestjs/common';
import {
  AuthenticationStorage,
  type RefreshTokenRecord,
  type RefreshTokenStore,
} from '@nestjs/authentication';
import { DataSource, IsNull, LessThanOrEqual } from 'typeorm';
import { isString } from '../../common/utilities/type-guard.utility.js';
import { SESSION_CLAIM } from '../constants/auth.constant.js';
import { AuthSession } from '../entities/auth-session.entity.js';
import { RefreshToken } from '../entities/refresh-token.entity.js';

/**
 * Keeps the refresh tokens of `@nestjs/authentication` in PostgreSQL, following the store
 * contract in its documentation. Revoking a family also ends the session it belongs to.
 */
@Injectable()
export class RefreshTokenTypeOrmStore implements RefreshTokenStore {
  constructor(
    private readonly dataSource: DataSource,
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({ refreshTokens: this });
  }

  private get manager() {
    return this.dataSource.manager;
  }

  async getRefreshToken(id: string): Promise<RefreshTokenRecord | undefined> {
    const row = await this.manager.findOneBy(RefreshToken, { id });
    if (!row) {
      return undefined;
    }
    return {
      id: row.id,
      familyId: row.familyId,
      userId: row.userId,
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      familyExpiresAt: row.familyExpiresAt,
      ...(row.usedAt && { usedAt: row.usedAt }),
      ...(row.claims && { claims: row.claims as Record<string, unknown> }),
    };
  }

  async saveRefreshToken(record: RefreshTokenRecord) {
    const sessionId = record.claims?.[SESSION_CLAIM];
    await this.manager.insert(RefreshToken, {
      id: record.id,
      familyId: record.familyId,
      userId: record.userId,
      sessionId: isString(sessionId) ? sessionId : null,
      createdAt: record.createdAt,
      expiresAt: record.expiresAt,
      familyExpiresAt: record.familyExpiresAt,
      usedAt: record.usedAt ?? null,
      claims: record.claims ?? null,
    });
    // Families past their absolute lifetime can never be used again, so the table stays bounded.
    await this.manager.delete(RefreshToken, { familyExpiresAt: LessThanOrEqual(record.createdAt) });
  }

  /** One conditional write: of two exchanges of the same token, exactly one succeeds. */
  async markRefreshTokenUsed(id: string, at: Date) {
    const { affected } = await this.manager.update(
      RefreshToken,
      { id, usedAt: IsNull() },
      { usedAt: at },
    );
    return affected === 1;
  }

  async revokeRefreshTokenFamily(familyId: string) {
    const tokens = await this.manager.find(RefreshToken, {
      where: { familyId },
      select: { sessionId: true },
    });
    await this.manager.update(RefreshToken, { familyId }, { isRevoked: true });
    const sessionIds = [
      ...new Set(tokens.flatMap((token) => (token.sessionId ? [token.sessionId] : []))),
    ];
    for (const sessionId of sessionIds) {
      await this.manager.update(
        AuthSession,
        { id: sessionId, revokedAt: IsNull() },
        { revokedAt: new Date() },
      );
    }
  }

  isRefreshTokenFamilyRevoked(familyId: string) {
    return this.manager.existsBy(RefreshToken, { familyId, isRevoked: true });
  }

  async revokeUserRefreshTokens(userId: string) {
    await this.manager.update(RefreshToken, { userId }, { isRevoked: true });
    await this.manager.update(
      AuthSession,
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }
}
