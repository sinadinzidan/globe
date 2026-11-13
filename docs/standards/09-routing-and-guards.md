# 09 · Routing and Route Guards

Covers React Router usage, and the auth guard, guest guard and protected routes.

## React Router

- Use the **latest React Router**, and follow its **current documentation** (<https://reactrouter.com>). Read the docs before setting up routing or changing it. Do not write routing from memory of an older version.
- Use the API and import path the current docs use. Do not mix styles or versions in one project.
- Route paths are enums or named constants, never inline strings (see [02](02-react-coding.md)).
- Routing is set up in `src/app/` (see [03](03-architecture-and-data.md)). Pages stay in `src/pages/`.
- Provide a catch-all route that renders the Not Found page from `src/pages/general/`.

Versions verified on 2026-11-09:

| Package | Latest | Requires |
|---------|--------|----------|
| `react-router` | 8.5.x | React `>=19.2.7`, Node `>=22.22.0` (satisfied by our Node 24 minimum) |
| `react-router-dom` | 7.18.x | React `>=18`. It is not updated alongside React Router 8. |

React Router 8 needs Node `22.22.0` or newer, which our Node 24 minimum in [01](01-frontend.md) satisfies. Check the docs for which package and import path to use before installing.

## Guards: general rules

Guards MUST be complete and work end to end. A guard that only works on the happy path is not acceptable.

- Guards are implemented once, as **layout routes** that render the child routes (`Outlet`). Do not repeat auth checks inside individual pages.
- A client-side guard controls what the user sees. It is **not** security. The backend MUST enforce authentication and authorisation on every request.
- A guard MUST NOT redirect or render protected content before the authentication status is known (see "Unknown status" below).

## Auth guard (protected routes)

Routes that need a signed-in user are wrapped in the auth guard.

- **Unauthenticated** user: redirect to the login page, and remember the page they asked for (path, query string and hash).
- **Authenticated** user: render the route.
- **Authenticated but not permitted** (wrong role or permission): render the Permission Denied page. This is different from not being signed in. Do not send them to login.
- Role and permission checks use named roles and permissions (enums), through the same guard mechanism.

## Guest guard

Routes for signed-out users only, such as login and sign up, are wrapped in the guest guard.

- **Authenticated** user: redirect away to the default signed-in page, or to the remembered destination.
- **Unauthenticated** user: render the route.

## Edge cases that MUST be handled

**Unknown status**
- On first load, and on page refresh, the session is being restored. While the status is unknown, show the shared loading state (see [06](06-ui-states-and-layout.md)). Do not flash the login page for a signed-in user, and do not flash protected content for a signed-out one.

**Redirects**
- After login, return the user to the page they originally asked for. If there is none, go to the default signed-in page.
- The remembered destination MUST be validated before use. Only same-origin relative paths are allowed. Reject anything else to prevent open redirects.
- Redirect with `replace`, so the Back button does not return to the guarded page or loop.
- Guards MUST NOT create redirect loops. The login page, the Permission Denied page and the Not Found page are never themselves redirected by the guards in a way that loops.

**Session ending**
- When a request returns `401`, or the session or token expires, sign the user out, clear sensitive state, and redirect to login with the remembered destination.
- On sign-out: clear the auth state and the server-data cache (RTK Query API state or the React Query client), so the next user never sees the previous user's data.
- Signing out in one browser tab MUST sign the user out in the others.
- After sign-out, the Back button MUST NOT show protected content.

**Navigation**
- Deep links to protected routes work when signed in, and after login when signed out.
- Refreshing a protected page keeps the user on it.
- Unknown URLs show Not Found, for signed-in and signed-out users.

## Verification

A guard change is not done until each case above has been checked, ideally by automated tests. At minimum:

1. Signed out, open a protected URL: sent to login, then returned there after login.
2. Signed in, open login or sign up: redirected to the default page.
3. Refresh a protected page while signed in: no flash, stays on the page.
4. Signed in without permission: Permission Denied shown.
5. Session expires or a request returns `401`: signed out and redirected.
6. Sign out: caches cleared, other tabs signed out, Back shows no protected content.
7. Malicious or external return URL: ignored.
8. Unknown URL: Not Found.

## For AI agents

- Read the current React Router docs before writing routing code.
- Build guards as layout routes covering every case above. Do not ship a guard that handles only signed in and signed out.
- Report which of the verification cases you checked.
