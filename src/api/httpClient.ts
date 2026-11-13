import {
  CREDENTIALS_MODE,
  CSRF_HEADER_NAME,
  CSRF_HEADER_VALUE,
  HTTP_STATUS,
  POST_METHOD,
  REFRESH_URL,
  SESSION_ENTRY_URLS,
  SESSION_HINT_STORAGE_KEY,
  SESSION_HINT_VALUE,
} from '@/constants/authConstants';

const DEFAULT_ERROR_MESSAGE = 'The request failed.';

/** A response the API answered with an error status. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let refreshInFlight: Promise<boolean> | null = null;
let handleSessionExpired = () => {
  // Replaced by the application once it knows how to sign the user out.
};

/** Registers what to do when a session can no longer be renewed. */
export const setSessionExpiredHandler = (handler: () => void) => {
  handleSessionExpired = handler;
};

const readSessionHint = () => {
  try {
    return window.localStorage.getItem(SESSION_HINT_STORAGE_KEY) === SESSION_HINT_VALUE;
  } catch {
    // Without storage the refresh is simply always tried.
    return true;
  }
};

/** Records whether this browser may hold a session. Called on sign-in and sign-out. */
export const setSessionHint = (hasSession: boolean) => {
  try {
    if (hasSession) {
      window.localStorage.setItem(SESSION_HINT_STORAGE_KEY, SESSION_HINT_VALUE);
    } else {
      window.localStorage.removeItem(SESSION_HINT_STORAGE_KEY);
    }
  } catch {
    // Storage can be unavailable. Nothing depends on the hint being kept.
  }
};

/** Every request sends the cookies and the CSRF header. Scripts never see the tokens. */
const send = (url: string, options: RequestInit) => {
  const headers = new Headers(options.headers);
  headers.set(CSRF_HEADER_NAME, CSRF_HEADER_VALUE);
  return fetch(url, { ...options, headers, credentials: CREDENTIALS_MODE });
};

/**
 * Renews the session. Requests that expire together share one call: while a refresh is under
 * way, later callers wait for it instead of starting their own, which the API would treat as
 * a reused token.
 */
const refreshSession = () => {
  refreshInFlight ??= send(REFRESH_URL, { method: POST_METHOD })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
};

const readErrorMessage = async (response: Response) => {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    const message = Array.isArray(body.message) ? body.message.join(' ') : body.message;
    return message ?? DEFAULT_ERROR_MESSAGE;
  } catch {
    return DEFAULT_ERROR_MESSAGE;
  }
};

/**
 * The one request function of the application, used by the generated API client. A 401 gets a
 * single refresh and a single retry. If that fails too, the session is over.
 */
export const httpClient = async <Result>(
  url: string,
  options: RequestInit = {},
): Promise<Result> => {
  let response = await send(url, options);
  const canRefresh =
    response.status === HTTP_STATUS.UNAUTHORIZED &&
    !SESSION_ENTRY_URLS.includes(url) &&
    readSessionHint();
  if (canRefresh) {
    if (await refreshSession()) {
      response = await send(url, options);
    }
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      setSessionHint(false);
      handleSessionExpired();
    }
  }
  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }
  const hasBody = response.status !== HTTP_STATUS.NO_CONTENT;
  return (hasBody ? await response.json() : undefined) as Result;
};
