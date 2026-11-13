import { BadRequestException, Injectable } from '@nestjs/common';
import argon2 from 'argon2';
import { COMMON_PASSWORDS, PASSWORD_TOO_COMMON_MESSAGE } from '../constants/password.constant.js';

/** A throwaway password hashed once, so an unknown email costs the same as a wrong password. */
const TIMING_DECOY_PASSWORD = 'timing-decoy-password';

@Injectable()
export class PasswordService {
  private decoyHash: Promise<string> | undefined;

  hash(password: string) {
    return argon2.hash(password, { type: argon2.argon2id });
  }

  /**
   * Checks a password against a stored hash. With no hash (an unknown email) it still does the
   * same work against a decoy, so the response time does not reveal which emails exist.
   */
  async verify(password: string, storedHash: string | undefined) {
    const hasMatched = await argon2.verify(storedHash ?? (await this.getDecoyHash()), password);
    return hasMatched && storedHash !== undefined;
  }

  /** Refuses passwords that are on every attacker's list. Length is checked by the DTO. */
  assertAcceptable(password: string) {
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
      throw new BadRequestException(PASSWORD_TOO_COMMON_MESSAGE);
    }
  }

  private getDecoyHash() {
    this.decoyHash ??= this.hash(TIMING_DECOY_PASSWORD);
    return this.decoyHash;
  }
}
