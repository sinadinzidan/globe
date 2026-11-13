export const WORK_ORDER_NUMBER_PREFIX = 'WO-';
export const WORK_ORDER_NUMBER_MINIMUM = 500_000;
export const WORK_ORDER_NUMBER_RANGE = 400_000;
/** How often a new number is tried when a generated one is already taken. */
export const WORK_ORDER_NUMBER_ATTEMPTS = 5;

/** PostgreSQL's error code for a unique constraint violation. */
export const UNIQUE_VIOLATION_CODE = '23505';

export const WORK_ORDER_MESSAGE = {
  NOT_FOUND: 'The work order was not found.',
  NUMBER_UNAVAILABLE: 'A work order number could not be assigned. Try again.',
} as const;
