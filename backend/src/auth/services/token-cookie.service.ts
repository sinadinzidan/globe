import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TokenPair } from '@nestjs/authentication';
import type { CookieOptions, Request, Response } from 'express';
import { type Environment, isEnabled } from '../../common/config/environment.js';
import { MILLISECONDS_PER_DAY } from '../../common/constants/throttle.constant.js';
import { isString } from '../../common/utilities/type-guard.utility.js';
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_COOKIE_PATH,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_PATH,
} from '../constants/auth.constant.js';

const MILLISECONDS_PER_SECOND = 1000;
const SAME_SITE_POLICY = 'strict';

/** Puts the tokens in cookies that scripts cannot read, and takes them out again. */
@Injectable()
export class TokenCookieService {
  constructor(private readonly configService: ConfigService<Environment, true>) {}

  /** Sets both token cookies. The tokens never appear in a response body. */
  write(response: Response, tokens: TokenPair) {
    const refreshLifetime =
      this.configService.get('REFRESH_TOKEN_TTL_DAYS', { infer: true }) * MILLISECONDS_PER_DAY;
    response.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
      ...this.baseOptions(ACCESS_TOKEN_COOKIE_PATH),
      maxAge: tokens.expiresIn * MILLISECONDS_PER_SECOND,
    });
    response.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      ...this.baseOptions(REFRESH_TOKEN_COOKIE_PATH),
      maxAge: refreshLifetime,
    });
  }

  clear(response: Response) {
    response.clearCookie(ACCESS_TOKEN_COOKIE, this.baseOptions(ACCESS_TOKEN_COOKIE_PATH));
    response.clearCookie(REFRESH_TOKEN_COOKIE, this.baseOptions(REFRESH_TOKEN_COOKIE_PATH));
  }

  readAccessToken(request: Request) {
    return this.read(request, ACCESS_TOKEN_COOKIE);
  }

  readRefreshToken(request: Request) {
    return this.read(request, REFRESH_TOKEN_COOKIE);
  }

  private read(request: Request, name: string) {
    const cookies = request.cookies as Record<string, unknown> | undefined;
    const value = cookies?.[name];
    return isString(value) && value.length > 0 ? value : undefined;
  }

  private baseOptions(path: string): CookieOptions {
    return {
      httpOnly: true,
      secure: isEnabled(this.configService.get('COOKIE_SECURE', { infer: true })),
      sameSite: SAME_SITE_POLICY,
      path,
    };
  }
}
