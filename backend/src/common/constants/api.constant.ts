export const API_PREFIX = 'api';
export const SWAGGER_PATH = 'api/docs';
export const SWAGGER_TITLE = 'Globe API';
export const SWAGGER_DESCRIPTION =
  'Plants, assets and work orders, with cookie-based sign-in and role and permission based access control.';
export const SWAGGER_VERSION = '1.0';

/** Name of the cookie security scheme in the OpenAPI document. */
export const COOKIE_AUTH_SCHEME = 'access-token-cookie';

/** The header every state-changing request must carry. A cross-site form cannot set it. */
export const CSRF_HEADER_NAME = 'x-requested-with';
export const CSRF_HEADER_VALUE = 'globe-web';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAXIMUM_PAGE_SIZE = 100;

export const ERROR_MESSAGE = {
  CSRF_HEADER_MISSING: 'This request is missing the required request header.',
  NOT_FOUND: 'The requested item was not found.',
} as const;
