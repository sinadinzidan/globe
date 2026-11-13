export const PASSWORD_MINIMUM_LENGTH = 12;
export const PASSWORD_MAXIMUM_LENGTH = 128;

export const PASSWORD_TOO_COMMON_MESSAGE =
  'This password is too common. Choose a less predictable one.';

/**
 * Passwords refused outright because they lead every breach list. Compared in lower case.
 * Only entries that meet the minimum length are needed.
 */
export const COMMON_PASSWORDS: readonly string[] = [
  'password1234',
  'password12345',
  'password123456',
  '123456789012',
  '1234567890123',
  'qwertyuiop12',
  'qwertyuiop123',
  'qwerty123456',
  'iloveyou1234',
  'administrator',
  'administrator1',
  'welcome12345',
  'letmein12345',
  'changeme1234',
  'passwordpassword',
  'abcdefghijkl',
  'abcd12345678',
  '111111111111',
  '000000000000',
  'aaaaaaaaaaaa',
];
