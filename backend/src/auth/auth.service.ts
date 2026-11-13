import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenError, type TokenPair } from '@nestjs/authentication';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { MILLISECONDS_PER_MINUTE } from '../common/constants/throttle.constant.js';
import type { User } from '../user/entities/user.entity.js';
import { UserService } from '../user/user.service.js';
import { AUTH_MESSAGE, LOCKOUT_MINUTES, MAXIMUM_FAILED_LOGINS } from './constants/auth.constant.js';
import type { ChangePasswordDto } from './dto/change-password.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import { PasswordService } from '../common/services/password.service.js';
import { SessionService } from './services/session.service.js';
import type { ClientDetails } from './types/client-details.type.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Signs a user in. An unknown email, a wrong password, a deactivated account and a locked
   * account all get the same answer after the same work, so none can be told apart.
   */
  async login(credentials: LoginDto, client: ClientDetails): Promise<TokenPair> {
    const user = await this.userService.findForLogin(credentials.email);
    const hasValidPassword = await this.passwordService.verify(
      credentials.password,
      user?.passwordHash,
    );
    if (!user || !this.canSignIn(user)) {
      this.logger.warn(`Sign-in refused from ${client.ipAddress ?? 'an unknown address'}.`);
      throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS);
    }
    if (!hasValidPassword) {
      await this.recordFailedLogin(user);
      throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS);
    }
    await this.userService.clearFailedLogins(user.id);
    this.logger.log(`User ${user.id} signed in.`);
    return this.sessionService.start(user.id, client);
  }

  /** Exchanges the refresh token for a new pair. Any refusal is the same 401. */
  async refresh(refreshToken: string | undefined): Promise<TokenPair> {
    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_MESSAGE.SESSION_ENDED);
    }
    try {
      return await this.sessionService.rotate(refreshToken);
    } catch (error) {
      if (error instanceof RefreshTokenError) {
        this.logger.warn(`Refresh token refused: ${error.reason}.`);
        throw new UnauthorizedException(AUTH_MESSAGE.SESSION_ENDED);
      }
      throw error;
    }
  }

  async logout(user: AuthenticatedUser) {
    await this.sessionService.end(user.sessionId);
    this.logger.log(`User ${user.id} signed out.`);
  }

  /**
   * Changes the user's own password, ends every session they have, and starts a fresh one for
   * the device that made the change.
   */
  async changePassword(user: AuthenticatedUser, change: ChangePasswordDto, client: ClientDetails) {
    const stored = await this.userService.findForLogin(user.email);
    if (!(await this.passwordService.verify(change.currentPassword, stored?.passwordHash))) {
      throw new BadRequestException(AUTH_MESSAGE.CURRENT_PASSWORD_INCORRECT);
    }
    if (change.newPassword === change.currentPassword) {
      throw new BadRequestException(AUTH_MESSAGE.PASSWORD_UNCHANGED);
    }
    await this.userService.setPassword(user.id, change.newPassword);
    this.logger.log(`User ${user.id} changed their password. All sessions were ended.`);
    return this.sessionService.start(user.id, client);
  }

  private canSignIn(user: User) {
    const isLocked = user.lockedUntil !== null && user.lockedUntil.getTime() > Date.now();
    return user.isActive && !isLocked;
  }

  /** Counts a wrong password, and locks the account for a while after too many in a row. */
  private async recordFailedLogin(user: User) {
    const failedLoginCount = user.failedLoginCount + 1;
    const shouldLock = failedLoginCount >= MAXIMUM_FAILED_LOGINS;
    await this.userService.recordFailedLogin(
      user.id,
      shouldLock ? 0 : failedLoginCount,
      shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * MILLISECONDS_PER_MINUTE) : null,
    );
    this.logger.warn(
      shouldLock
        ? `User ${user.id} is locked out after ${String(MAXIMUM_FAILED_LOGINS)} wrong passwords.`
        : `Wrong password for user ${user.id}.`,
    );
  }
}
