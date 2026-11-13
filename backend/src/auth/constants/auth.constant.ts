export const ACCESS_TOKEN_COOKIE = 'globe_access';
export const REFRESH_TOKEN_COOKIE = 'globe_refresh';

/** The access token is sent to the whole API; the refresh token only to the auth routes. */
export const ACCESS_TOKEN_COOKIE_PATH = '/api';
export const REFRESH_TOKEN_COOKIE_PATH = '/api/auth';

/** The claim that ties an access token to its session, so ending the session ends the token. */
export const SESSION_CLAIM = 'sid';
export const SIGN_IN_METHOD = 'password';

export const MAXIMUM_FAILED_LOGINS = 5;
export const LOCKOUT_MINUTES = 15;

export const USER_AGENT_MAXIMUM_LENGTH = 400;

export const AUTH_MESSAGE = {
  INVALID_CREDENTIALS: 'The email or password is incorrect.',
  SESSION_ENDED: 'The session has ended. Sign in again.',
  CURRENT_PASSWORD_INCORRECT: 'The current password is incorrect.',
  PASSWORD_UNCHANGED: 'The new password must be different from the current one.',
  SESSION_NOT_FOUND: 'The session was not found.',
} as const;
