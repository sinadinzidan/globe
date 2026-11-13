const STRING_TYPE = 'string';

/** Whether a value of unknown origin is a string. */
export const isString = (value: unknown): value is string => typeof value === STRING_TYPE;
