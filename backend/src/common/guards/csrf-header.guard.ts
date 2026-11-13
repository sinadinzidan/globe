import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { CSRF_HEADER_NAME, CSRF_HEADER_VALUE, ERROR_MESSAGE } from '../constants/api.constant.js';

const SAFE_METHODS: readonly string[] = ['GET', 'HEAD', 'OPTIONS'];

/**
 * Requires a custom header on every state-changing request. Browsers do not let another site
 * add it without a CORS preflight, which only the allowed origins pass, so a forged cross-site
 * request is refused even though the browser attaches the cookies to it.
 */
@Injectable()
export class CsrfHeaderGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    if (SAFE_METHODS.includes(request.method)) {
      return true;
    }
    if (request.get(CSRF_HEADER_NAME) !== CSRF_HEADER_VALUE) {
      throw new ForbiddenException(ERROR_MESSAGE.CSRF_HEADER_MISSING);
    }
    return true;
  }
}
