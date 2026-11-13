import {
  DEFAULT_SIGNED_IN_PATH,
  RETURN_TO_SEARCH_PARAMETER,
  ROUTE_PATH,
} from '@/constants/routeConstants';
import { RoutePath } from '@/enums/routePath';

const PATH_SEPARATOR = '/';
const BACKSLASH = '\\';

/**
 * The page to go to after signing in. Only a path inside this application is accepted: anything
 * that could lead to another site, or back to the login page, falls back to the default page.
 */
export const toSafeReturnPath = (candidate: string | null) => {
  if (!candidate?.startsWith(PATH_SEPARATOR) || candidate.includes(BACKSLASH)) {
    return DEFAULT_SIGNED_IN_PATH;
  }
  try {
    const resolved = new URL(candidate, window.location.origin);
    const isSameOrigin = resolved.origin === window.location.origin;
    const isLoginPage = resolved.pathname === ROUTE_PATH[RoutePath.LOGIN];
    return isSameOrigin && !isLoginPage
      ? `${resolved.pathname}${resolved.search}${resolved.hash}`
      : DEFAULT_SIGNED_IN_PATH;
  } catch {
    return DEFAULT_SIGNED_IN_PATH;
  }
};

/** The login address that remembers the page the user asked for. */
export const toLoginPath = (requestedPath: string) => {
  const search = new URLSearchParams({ [RETURN_TO_SEARCH_PARAMETER]: requestedPath });
  return `${ROUTE_PATH[RoutePath.LOGIN]}?${search.toString()}`;
};
