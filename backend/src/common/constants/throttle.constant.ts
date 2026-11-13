export const MILLISECONDS_PER_MINUTE = 60_000;
export const MILLISECONDS_PER_DAY = 86_400_000;

/** Requests allowed per minute from one address, on every route. */
export const DEFAULT_RATE_LIMIT = 300;

export const DEFAULT_THROTTLER_NAME = 'default';
/** The stricter limit that only counts sign-in, refresh and password routes. */
export const AUTH_THROTTLER_NAME = 'auth';

/** Metadata key that marks a route as counted by the stricter limit. */
export const AUTH_RATE_LIMITED_KEY = 'authRateLimited';
