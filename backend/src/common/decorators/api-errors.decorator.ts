import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { COOKIE_AUTH_SCHEME } from '../constants/api.constant.js';
import type { Permission } from '../enums/permission.enum.js';

const UNAUTHENTICATED_DESCRIPTION = 'Not signed in, or the session has ended.';
const TOO_MANY_REQUESTS_DESCRIPTION = 'Too many requests. Try again later.';

/**
 * Documents a signed-in route: the cookie scheme, the permissions it needs, and the 401, 403
 * and 429 answers every such route can give.
 */
export const ApiProtected = (...permissions: Permission[]) =>
  applyDecorators(
    ApiCookieAuth(COOKIE_AUTH_SCHEME),
    ApiUnauthorizedResponse({ description: UNAUTHENTICATED_DESCRIPTION }),
    ApiForbiddenResponse({
      description:
        permissions.length > 0
          ? `Requires the permission ${permissions.join(' or ')}, or the request header is missing.`
          : 'The required request header is missing.',
    }),
    ApiTooManyRequestsResponse({ description: TOO_MANY_REQUESTS_DESCRIPTION }),
  );
