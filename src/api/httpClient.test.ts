import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, httpClient, setSessionExpiredHandler, setSessionHint } from '@/api/httpClient';
import {
  CSRF_HEADER_NAME,
  CSRF_HEADER_VALUE,
  HTTP_STATUS,
  REFRESH_URL,
} from '@/constants/authConstants';

const PLANTS_URL = '/api/plants';
const ASSETS_URL = '/api/plants/alpha/assets';
const LOGIN_URL = '/api/auth/login';
const OK_STATUS = 200;
const CONCURRENT_REQUESTS = 5;

const respond = (status: number, body: unknown = {}) =>
  new Response(status === HTTP_STATUS.NO_CONTENT ? null : JSON.stringify(body), { status });

/** A stand-in for the API whose access token has expired until the session is refreshed. */
const createExpiredSessionApi = (canRefresh: boolean) => {
  const calls: string[] = [];
  let hasFreshToken = false;
  const fetchMock = vi.fn((url: string) => {
    calls.push(url);
    if (url === REFRESH_URL) {
      hasFreshToken = canRefresh;
      return Promise.resolve(
        respond(canRefresh ? HTTP_STATUS.NO_CONTENT : HTTP_STATUS.UNAUTHORIZED),
      );
    }
    return Promise.resolve(respond(hasFreshToken ? OK_STATUS : HTTP_STATUS.UNAUTHORIZED, { url }));
  });
  vi.stubGlobal('fetch', fetchMock);
  return { calls, fetchMock };
};

const countCalls = (calls: string[], url: string) => calls.filter((call) => call === url).length;

describe('httpClient', () => {
  const onSessionExpired = vi.fn();

  beforeEach(() => {
    setSessionHint(true);
    setSessionExpiredHandler(onSessionExpired);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    onSessionExpired.mockReset();
  });

  it('sends the cookies and the CSRF header with every request', async () => {
    const fetchMock = vi.fn(() => Promise.resolve(respond(OK_STATUS, [])));
    vi.stubGlobal('fetch', fetchMock);

    await httpClient(PLANTS_URL);

    const [, options] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(options.credentials).toBe('include');
    expect(new Headers(options.headers).get(CSRF_HEADER_NAME)).toBe(CSRF_HEADER_VALUE);
  });

  it('refreshes once and retries once after a 401', async () => {
    const { calls } = createExpiredSessionApi(true);

    await expect(httpClient(PLANTS_URL)).resolves.toEqual({ url: PLANTS_URL });

    expect(calls).toEqual([PLANTS_URL, REFRESH_URL, PLANTS_URL]);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('shares a single refresh between requests that expire together', async () => {
    const { calls } = createExpiredSessionApi(true);

    const results = await Promise.all(
      Array.from({ length: CONCURRENT_REQUESTS }, (_unused, index) =>
        httpClient(index % (1 + 1) === 0 ? PLANTS_URL : ASSETS_URL),
      ),
    );

    expect(results).toHaveLength(CONCURRENT_REQUESTS);
    expect(countCalls(calls, REFRESH_URL)).toBe(1);
  });

  it('ends the session when the refresh fails, without retrying again', async () => {
    const { calls } = createExpiredSessionApi(false);

    await expect(httpClient(PLANTS_URL)).rejects.toBeInstanceOf(ApiError);

    expect(calls).toEqual([PLANTS_URL, REFRESH_URL]);
    expect(onSessionExpired).toHaveBeenCalledOnce();
  });

  it('does not refresh for a failed sign-in', async () => {
    const { calls } = createExpiredSessionApi(true);

    await expect(httpClient(LOGIN_URL, { method: 'POST' })).rejects.toMatchObject({
      status: HTTP_STATUS.UNAUTHORIZED,
    });

    expect(calls).toEqual([LOGIN_URL]);
  });

  it('does not refresh for a visitor who never signed in', async () => {
    setSessionHint(false);
    const { calls } = createExpiredSessionApi(true);

    await expect(httpClient(PLANTS_URL)).rejects.toBeInstanceOf(ApiError);

    expect(calls).toEqual([PLANTS_URL]);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('reports the API’s message for a refused request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(respond(HTTP_STATUS.FORBIDDEN, { message: 'Forbidden resource' })),
      ),
    );

    await expect(httpClient(PLANTS_URL)).rejects.toMatchObject({
      status: HTTP_STATUS.FORBIDDEN,
      message: 'Forbidden resource',
    });
  });
});
