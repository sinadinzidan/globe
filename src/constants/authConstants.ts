import { Permission } from '@/enums/permission';
import { Role } from '@/enums/role';

/** The header the API requires on every state-changing request, as protection against CSRF. */
export const CSRF_HEADER_NAME = 'X-Requested-With';
export const CSRF_HEADER_VALUE = 'globe-web';

export const REFRESH_URL = '/api/auth/refresh';
/** Requests that establish a session. A 401 from them is an answer, not an expired session. */
export const SESSION_ENTRY_URLS: readonly string[] = ['/api/auth/login', REFRESH_URL];

export const HTTP_STATUS = {
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const;

/**
 * Remembers that this browser has signed in, so a visitor who never did is not sent through a
 * pointless token refresh. It holds no token: only the fact that a session may exist.
 */
export const SESSION_HINT_STORAGE_KEY = 'globe.session-hint';
export const SESSION_HINT_VALUE = '1';

export const POST_METHOD = 'POST';
export const CREDENTIALS_MODE = 'include';

/** Name of the channel that tells the other tabs of this browser about signing in and out. */
export const AUTH_CHANNEL_NAME = 'globe-auth';

const MILLISECONDS_PER_MINUTE = 60_000;
const CURRENT_USER_STALE_MINUTES = 5;
export const CURRENT_USER_STALE_TIME_MILLISECONDS =
  CURRENT_USER_STALE_MINUTES * MILLISECONDS_PER_MINUTE;

export const PASSWORD_MINIMUM_LENGTH = 12;

export const ROLE_LABEL: Record<Role, string> = {
  [Role.ADMINISTRATOR]: 'Administrator',
  [Role.PLANT_MANAGER]: 'Plant manager',
  [Role.RELIABILITY_ENGINEER]: 'Reliability engineer',
  [Role.MAINTENANCE_PLANNER]: 'Maintenance planner',
  [Role.INSPECTOR]: 'Inspector',
  [Role.OPERATOR]: 'Operator',
  [Role.VIEWER]: 'Viewer',
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  [Role.ADMINISTRATOR]: 'Full access to every plant, and manages users.',
  [Role.PLANT_MANAGER]: 'Everything about the assigned plants, including all their work orders.',
  [Role.RELIABILITY_ENGINEER]: 'Studies assets across every plant and raises work orders.',
  [Role.MAINTENANCE_PLANNER]: 'Plans and updates work orders in the assigned plants.',
  [Role.INSPECTOR]: 'Sees inspections and documents in the assigned plants.',
  [Role.OPERATOR]: 'Watches performance in the assigned plants and reports problems.',
  [Role.VIEWER]: 'Sees the assigned plants and their assets, nothing more.',
};

export const PERMISSION_LABEL: Record<Permission, string> = {
  [Permission.PLANT_READ]: 'See plants',
  [Permission.PLANT_READ_ALL]: 'See every plant, not only assigned ones',
  [Permission.ASSET_READ]: 'See assets',
  [Permission.ASSET_PERFORMANCE_READ]: 'See asset performance',
  [Permission.ASSET_INSPECTION_READ]: 'See inspections',
  [Permission.ASSET_DOCUMENT_READ]: 'See documents',
  [Permission.WORK_ORDER_READ]: 'See work orders',
  [Permission.WORK_ORDER_CREATE]: 'Raise work orders',
  [Permission.WORK_ORDER_UPDATE_OWN]: 'Change work orders they raised',
  [Permission.WORK_ORDER_UPDATE_ANY]: 'Change any work order',
  [Permission.USER_READ]: 'See users',
  [Permission.USER_MANAGE]: 'Manage users',
  [Permission.ROLE_READ]: 'See roles and permissions',
};

export const ROLE_ORDER = Object.values(Role);
export const PERMISSION_ORDER = Object.values(Permission);

export const AUTH_COPY = {
  LOGIN_TITLE: 'Sign in',
  LOGIN_DESCRIPTION: 'Sign in to see the plants and assets you have access to.',
  EMAIL_LABEL: 'Email',
  PASSWORD_LABEL: 'Password',
  SIGN_IN: 'Sign in',
  SIGNING_IN: 'Signing in…',
  INVALID_CREDENTIALS: 'The email or password is incorrect.',
  TOO_MANY_ATTEMPTS: 'Too many attempts. Wait a minute and try again.',
  SIGN_IN_FAILED: 'Signing in did not work. Check your connection and try again.',
  EMAIL_REQUIRED: 'Enter your email.',
  PASSWORD_REQUIRED: 'Enter your password.',
  SIGN_OUT: 'Sign out',
  ACCOUNT: 'Account',
  USERS: 'Users',
  ROLES: 'Roles and permissions',
  USER_MENU_LABEL: 'Account menu',
  RESTORING_SESSION: 'Checking your session…',
  SERVER_UNAVAILABLE_TITLE: 'The server cannot be reached',
  SERVER_UNAVAILABLE_DESCRIPTION:
    'Your session could not be checked. Check your connection and try again.',
  PERMISSION_DENIED_TITLE: 'You do not have access to this page',
  PERMISSION_DENIED_DESCRIPTION:
    'Your role does not include this page. Ask an administrator if you think it should.',
  BACK_TO_MAP: 'Back to the map',
} as const;
