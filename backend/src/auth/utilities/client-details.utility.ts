import type { Request } from 'express';
import { USER_AGENT_MAXIMUM_LENGTH } from '../constants/auth.constant.js';
import type { ClientDetails } from '../types/client-details.type.js';

const USER_AGENT_HEADER = 'user-agent';

/** What to record about the device a request came from. */
export const toClientDetails = (request: Request): ClientDetails => ({
  userAgent: request.get(USER_AGENT_HEADER)?.slice(0, USER_AGENT_MAXIMUM_LENGTH) ?? null,
  ipAddress: request.ip ?? null,
});
