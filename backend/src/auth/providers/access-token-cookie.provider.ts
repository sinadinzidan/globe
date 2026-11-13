import { type ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationError,
  AuthenticationProvider,
  AuthenticationRegistry,
  type AuthenticationResult,
  type JwtClaims,
  JwtVerifier,
} from '@nestjs/authentication';
import type { Request } from 'express';
import type { Environment } from '../../common/config/environment.js';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type.js';
import { isString } from '../../common/utilities/type-guard.utility.js';
import { UserService } from '../../user/user.service.js';
import { AUTH_MESSAGE, SESSION_CLAIM } from '../constants/auth.constant.js';
import { SessionService } from '../services/session.service.js';
import { TokenCookieService } from '../services/token-cookie.service.js';

const SIGNING_ALGORITHM = 'HS256';

/**
 * Signs a request in from the access token cookie. The token's signature, expiry, issuer and
 * audience are verified with a pinned algorithm; then the session and the user are read from
 * the database, so a revoked session, a deactivated user or a changed role takes effect at once.
 */
@Injectable()
export class AccessTokenCookieProvider extends AuthenticationProvider<
  AuthenticatedUser,
  JwtClaims
> {
  private readonly verifier: JwtVerifier;

  constructor(
    private readonly tokenCookieService: TokenCookieService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    configService: ConfigService<Environment, true>,
    registry: AuthenticationRegistry,
  ) {
    super();
    this.verifier = new JwtVerifier({
      key: configService.get('JWT_SECRET', { infer: true }),
      algorithms: [SIGNING_ALGORITHM],
      issuer: configService.get('JWT_ISSUER', { infer: true }),
      audience: configService.get('JWT_AUDIENCE', { infer: true }),
      required: ['exp', 'sub', SESSION_CLAIM],
    });
    registry.registerProvider(this);
  }

  async authenticate(
    context: ExecutionContext,
  ): Promise<AuthenticationResult<AuthenticatedUser, JwtClaims> | null> {
    const token = this.tokenCookieService.readAccessToken(
      context.switchToHttp().getRequest<Request>(),
    );
    if (!token) {
      return null;
    }
    // Throws a 401 for a malformed, tampered, expired, wrong-issuer or wrong-audience token.
    const claims = await this.verifier.verify(token);
    const sessionId = claims[SESSION_CLAIM];
    if (!isString(sessionId) || !claims.sub) {
      throw new AuthenticationError(AUTH_MESSAGE.SESSION_ENDED);
    }
    const session = await this.sessionService.findActive(sessionId);
    const user =
      session?.userId === claims.sub
        ? await this.userService.findAuthenticated(claims.sub, sessionId)
        : null;
    if (!user) {
      throw new AuthenticationError(AUTH_MESSAGE.SESSION_ENDED);
    }
    return { user, session: claims };
  }
}
