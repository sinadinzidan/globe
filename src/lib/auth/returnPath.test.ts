import { describe, expect, it } from 'vitest';
import { DEFAULT_SIGNED_IN_PATH } from '@/constants/routeConstants';
import { toLoginPath, toSafeReturnPath } from '@/lib/auth/returnPath';

describe('toSafeReturnPath', () => {
  it.each(['/plants/ruwais-refinery', '/plants/a/assets/b?tab=MAINTENANCE', '/account#sessions'])(
    'keeps the in-application path %s',
    (path) => {
      expect(toSafeReturnPath(path)).toBe(path);
    },
  );

  it.each([
    null,
    '',
    'https://evil.example/steal',
    '//evil.example',
    '/\\evil.example',
    'javascript:alert(1)',
    'plants/relative',
    '/login',
    '/login?returnTo=%2Fmap',
  ])('falls back to the default page for %s', (candidate) => {
    expect(toSafeReturnPath(candidate)).toBe(DEFAULT_SIGNED_IN_PATH);
  });
});

describe('toLoginPath', () => {
  it('remembers the requested page, including its query string and hash', () => {
    const requested = '/plants/a/assets/b?tab=MAINTENANCE#top';
    const loginPath = toLoginPath(requested);
    const returnTo = new URL(loginPath, window.location.origin).searchParams.get('returnTo');
    expect(returnTo).toBe(requested);
    expect(toSafeReturnPath(returnTo)).toBe(requested);
  });
});
