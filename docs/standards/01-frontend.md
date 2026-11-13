# 01 · Frontend: React and Vite

Covers the frontend stack, the toolchain versions it requires, and how those versions are enforced.

## Stack

- The frontend MUST use **React** (latest stable major) built with **Vite** (latest stable major).
- New projects MUST start on the latest stable release of both. Do not start on a superseded major.
- `@vitejs/plugin-react` MUST be on the major that matches the installed Vite major.

Versions verified on 2026-11-09:

| Package | Latest stable | Requires |
|---------|---------------|----------|
| `react`, `react-dom` | 19.3.x | no Node floor |
| `vite` | 8.3.x | Node `^20.19.0 \|\| >=22.12.0` |
| `@vitejs/plugin-react` | 6.3.x | Node `^20.19.0 \|\| >=22.12.0`, Vite `^8` |

## Minimum toolchain versions

| Tool | Minimum | Reason |
|------|---------|--------|
| Node.js | **24.0.0** | Node 24 is our minimum across all projects. It satisfies Vite (`^20.19.0 \|\| >=22.12.0`) and React Router 8 (`>=22.22.0`). |
| npm | **11.3.0** | The npm bundled with Node 24.0.0. |

- Developers and CI SHOULD use the current Node LTS. The minimum is a floor, not a target.
- The minimums MUST be raised, never silently lowered, when a dependency's requirement rises.
- Re-check this table whenever React or Vite changes major version.

## Enforcement

Every frontend project MUST enforce the minimums in three places:

1. `package.json`:
   ```json
   "engines": { "node": ">=24.0.0", "npm": ">=11.3.0" }
   ```
2. `.npmrc`, so installs fail instead of warning:
   ```
   engine-strict=true
   ```
3. `.nvmrc` (or equivalent), so tools select the right Node version:
   ```
   24.0.0
   ```

CI MUST run on a Node version that satisfies `engines`, and MUST fail if it does not.

## For AI agents

- Before adding or upgrading a dependency, check that its `engines` field is satisfied by the minimums above. If it is not, say so and ask before proceeding.
- Do not generate code or configuration for a lower React or Vite major than the one stated here.
