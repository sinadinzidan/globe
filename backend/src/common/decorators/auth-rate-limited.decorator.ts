import { SetMetadata } from '@nestjs/common';
import { AUTH_RATE_LIMITED_KEY } from '../constants/throttle.constant.js';

/** Counts the route against the stricter limit for sign-in and password routes. */
export const AuthRateLimited = () => SetMetadata(AUTH_RATE_LIMITED_KEY, true);
