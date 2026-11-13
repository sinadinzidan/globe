# 05 · Tooling That Enforces the Standards

Covers the lint, format and type-check tooling that enforces the standards automatically, and which rules it cannot enforce.

## Principle

A rule that a tool can check MUST be checked by a tool. Humans and AI agents both run the same checks, and a change that fails them is not done.

## Files

Reference configuration lives in [`tooling/frontend/`](../../tooling/frontend/). Copy it into the frontend project root:

| File | Purpose |
|------|---------|
| `eslint.config.js` | ESLint flat config implementing the rules below |
| `eslint-rules/enumRules.js` | Local rule: enum value must equal its key |
| `.prettierrc.json` | Prettier formatting |

## Required packages

Install as dev dependencies:

`eslint`, `@eslint/js`, `typescript`, `typescript-eslint`, `eslint-plugin-check-file`, `eslint-plugin-unicorn`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-config-prettier`, `globals`, `prettier`

Versions verified on 2026-11-09 against Node 22 and 24:

| Package | Version | Note |
|---------|---------|------|
| `eslint` | 10.x | |
| `typescript-eslint` | 8.72.x | Supports TypeScript `>=4.8.4 <6.1.0` |
| `typescript` | **6.0.x** | The latest TypeScript (7.x) is outside `typescript-eslint`'s supported range. Stay on 6.0.x until `typescript-eslint` supports 7. |
| `eslint-plugin-unicorn` | 79.x | Requires Node 22 or newer (satisfied by our Node 24 minimum) |
| `eslint-plugin-check-file` | 3.3.x | |
| `prettier` | 3.9.x | |

Re-check this table whenever any of these packages changes major version.

## Scripts

Every frontend project MUST define these in `package.json`:

```json
"scripts": {
  "lint": "eslint .",
  "typecheck": "tsc --noEmit -p tsconfig.app.json",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

CI MUST run `lint`, `typecheck` and `format:check` and fail the build if any fails.

## TypeScript configuration

- `strict` MUST be `true`.
- `erasableSyntaxOnly` MUST be `false` or absent in every tsconfig, because the enum standard needs the `enum` keyword (see [02](02-react-coding.md)).

## What is enforced

| Standard | Rule | Enforced by |
|----------|------|-------------|
| 02 | `.tsx` files PascalCase, `.ts` files camelCase | `check-file/filename-naming-convention` |
| 02 | Folders kebab-case | `check-file/folder-naming-convention` |
| 02 | No single-letter names | `id-length` |
| 02 | No common abbreviations | `unicorn/name-replacements` |
| 02 | Boolean prefix (`is`, `has`, `can`, `should`, `did`, `will`) | `@typescript-eslint/naming-convention` |
| 02 | Enum name PascalCase, members `UPPER_SNAKE_CASE` | `@typescript-eslint/naming-convention` |
| 02 | Enum value equals key, string values only | `local-enum/enum-value-matches-key` |
| 02 | No string-literal unions, use enums | `no-restricted-syntax` |
| 02 | Top-level string and number constants `UPPER_SNAKE_CASE` | `@typescript-eslint/naming-convention` |
| 02 | No magic numbers (`0`, `1`, `-1` allowed) | `@typescript-eslint/no-magic-numbers` |
| 02 | No comparing or switching against string literals | `no-restricted-syntax` |
| 02 | Hooks called correctly | `eslint-plugin-react-hooks` |
| 01 | Node and npm minimums | `engine-strict` in `.npmrc` (see [01](01-frontend.md)) |

## What is not enforced by tools

These rules still apply and are checked in code review, and by agents reading the standards:

- **Abbreviations** beyond the dictionary in `unicorn/name-replacements`. A name like `usr` is not caught.
- **String magic values** other than comparisons and `switch` cases, such as strings in function arguments, object properties and JSX.
- **Component structure and logical grouping** (02): group order, blank lines, effects before `return`.
- **Prop drilling** (03).
- **Pages and components folder mirroring** (03), and the location of types, constants, enums and hooks (04).
- **Check before you declare** (04).
- **RTK Query tags and React Query invalidation** (03).

## Exceptions

- Use the exemption in `eslint.config.js` for tool-mandated file names, currently `vite-env.d.ts`. Add to it only when a tool requires the name.
- Do not disable a rule with an inline `eslint-disable` comment to get a change through. If a rule is wrong, change the standard and the config.

## For AI agents

- Run `lint`, `typecheck` and `format:check` before reporting work as done, and fix every failure.
- Do not suppress, weaken or bypass a rule to make a check pass.
- Passing the tools does not mean the unenforced rules are satisfied. Follow them too.
