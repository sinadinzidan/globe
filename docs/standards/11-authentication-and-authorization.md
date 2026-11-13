# 11 · Authentication and Authorization

Covers how users are authenticated and authorised, in the backend and the frontend. This layer MUST be correct and complete. Follow the OWASP guidance (the Authentication, Session Management, Access Control and Password Storage cheat sheets, and ASVS) and the current NestJS documentation: <https://docs.nestjs.com/security/authentication> and <https://docs.nestjs.com/security/authorization>.

## Approach

- **Access token:** a short-lived signed JWT (minutes, not days).
- **Refresh token:** a long-lived, random, opaque token that is **rotated on every use**.
- **Storage in the browser:** both tokens live in `HttpOnly`, `Secure`, `SameSite` cookies. Tokens MUST NOT be stored in `localStorage`, `sessionStorage` or any place JavaScript can read.
- The frontend and the API SHOULD be served from the same site, so the cookies are first-party.
- Authentication and authorisation are enforced by the **backend**. The frontend only reflects the result (see [09](09-routing-and-guards.md)).

Versions verified on 2026-11-09: `@nestjs/passport` 12.0.x, `@nestjs/jwt` 12.0.x, `passport-jwt` 4.0.x, `argon2` 0.45.x.

## Backend: authentication

**Passwords**
- Hash with **Argon2id** (or bcrypt where Argon2 is unavailable). Never store, log or return a password or hash.
- Enforce a sensible minimum length and check against common-password lists. Do not impose arbitrary composition rules.
- Compare secrets with constant-time functions.

**Login**
- Use the same response and similar timing for "unknown user" and "wrong password". Never reveal which one failed.
- Rate-limit login, refresh, password reset and similar routes, with stricter limits than the rest of the API. Add temporary lockout or backoff after repeated failures.
- Log authentication events (success, failure, logout, token reuse) without logging secrets.

**Access tokens**
- Sign with a strong secret or key from validated configuration. Pin the algorithm. Never accept `none` or an algorithm chosen by the token.
- Set and verify `exp`, `iss` and `aud`. Keep the payload minimal: user identifier and what is needed to authorise, no sensitive data.

**Refresh tokens**
- Generate with a cryptographically secure random source. Store only a **hash** in the database, never the token.
- **Rotate on every use**: issue a new refresh token and invalidate the old one.
- **Detect reuse.** If an already-used refresh token is presented, treat the session family as compromised and revoke all of it.
- Give refresh tokens an absolute expiry. Bind them to a session record that can be revoked.

**Sessions**
- Logout revokes the server-side session and clears the cookies.
- Changing or resetting a password revokes all of that user's sessions.
- Let users see and revoke their sessions where the product needs it.

**Cookies and CSRF**
- Cookies are `HttpOnly`, `Secure` and `SameSite` (`Lax` or `Strict`), scoped to the narrowest path and domain.
- Because cookies are sent automatically, state-changing routes MUST be protected against CSRF: `SameSite`, plus a CSRF token or a required custom header, and strict CORS with an explicit origin allowlist and credentials enabled only for it.

**Account flows**
- Password reset and email verification use single-use, short-lived, random tokens stored hashed. A reset request returns the same response whether or not the account exists.
- Multi-factor authentication SHOULD be supported for privileged accounts.

## Backend: authorization

- **Deny by default.** Register the authentication guard globally, and mark the few public routes explicitly with a `@Public()` decorator. A new route is protected unless someone deliberately opens it.
- Use **role and permission based access control**. Roles and permissions are enums ([02](02-react-coding.md)), checked by a guard that reads metadata from a decorator on the route.
- Role checks are not enough. Services MUST also check **ownership and object-level access** (a user may change only their own record unless a permission says otherwise). This prevents broken object-level authorisation.
- Never trust identifiers, roles or permissions sent by the client. Take the user from the verified token.
- Return `401` when not authenticated and `403` when authenticated but not permitted. Do not leak whether a resource exists to someone who may not see it.
- Document the authentication scheme and the required permissions on every endpoint in Swagger, in the same change ([10](10-backend.md)).

## Frontend

- **Auth state comes from the server.** After load or refresh, ask the API who the user is (a "current user" request) and keep the result in the data layer. This is the "unknown status" step in [09](09-routing-and-guards.md).
- Requests send cookies (`credentials: 'include'` or the equivalent). The frontend never reads, stores or attaches tokens itself.
- **Token refresh:** when a request returns `401`, make **one** refresh attempt, and retry the original request once. If several requests fail at the same time they share a single refresh call. If the refresh fails, sign the user out and redirect to login. Implement this once, in the base query (RTK Query) or the shared request layer (React Query), never per call.
- **Sign-out** calls the API to revoke the session, then clears auth state and the server-data cache, signs out other tabs, and redirects (see [09](09-routing-and-guards.md)).
- Permission checks in the UI (hiding a button, a route guard) are for usability only. The backend always checks again.
- Send CSRF protection as the backend requires.
- Never render untrusted HTML. Do not use `dangerouslySetInnerHTML` with user data. Use a Content Security Policy.
- Never put secrets in frontend code or environment variables that are bundled.

## Verification

Authentication and authorisation changes are not done until these have been checked, ideally by automated tests:

1. Wrong password and unknown user give the same response.
2. Login is rate-limited and locks out after repeated failures.
3. An expired, tampered, wrong-issuer or wrong-audience access token is rejected.
4. A refresh token works once. Reusing it revokes the whole session family.
5. Logout revokes the session. The old tokens no longer work.
6. A password change revokes other sessions.
7. A route with no decorator is protected. A `@Public()` route is the only way to be open.
8. A user cannot read or change another user's data (object-level check).
9. A user without the permission gets `403`. An unauthenticated user gets `401`.
10. A cross-site request without the CSRF protection is rejected.
11. Tokens are not readable from JavaScript, and are not in storage.
12. Concurrent expired requests cause exactly one refresh.
13. Swagger shows the auth scheme and permissions for every endpoint.

## For AI agents

- Read the current NestJS security docs before writing authentication or authorisation code.
- Do not invent a custom scheme. Use the approach above and the framework's guards.
- Never store tokens in browser storage, never log secrets, never skip an ownership check.
- Report which verification cases you checked. Do not call this layer done with any unchecked.
