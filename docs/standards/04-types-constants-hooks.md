# 04 · Types, Constants, Enums and Hooks

Covers where types, constants, enums and hooks are declared, and how to avoid duplicating them.

## Check before you declare

- Before declaring a type, constant, enum or hook, search the codebase for one that already exists. If it exists, import and use it. Do not declare a second copy.
- If an existing one is almost right, extend or adjust it. Do not create a near-duplicate under a different name.

## Local or shared

Where a declaration lives depends on who uses it:

| Used by | Where it lives |
|---------|----------------|
| One component only | In that component's file |
| More than one component | In the matching folder under `src/`, listed below |

- A declaration used by only one component MUST stay in that component's file.
- The moment a second place needs it, it MUST be moved to the shared folder and imported by both. Do not export it from a component file for others to import.

## Shared folders

Each kind of declaration has its own top-level folder in `src/`:

| Kind | Folder |
|------|--------|
| Types | `src/types/` |
| Constants | `src/constants/` |
| Enums | `src/enums/` |
| Hooks | `src/hooks/` |

Inside each folder, use the **same structure as `src/components/`** (see [03](03-architecture-and-data.md)): group folder, then page folder, in kebab-case.

- Place the file at the **lowest level that covers everything using it**. Used only by the components of `Users`: `…/dashboard/users/`. Used across the `dashboard` group: `…/dashboard/`. Used across groups: the root of the folder.

```
src/
  types/
    userTypes.ts                # used across groups
    dashboard/
      users/
        userTableTypes.ts       # used by components of Users only
  constants/
    dashboard/
      users/
        userTableConstants.ts
  enums/
    userStatus.ts
  hooks/
    useCurrentUser.ts
    dashboard/
      users/
        useUserFilters.ts
```

## Naming

Files follow [02](02-react-coding.md): folders in kebab-case, `.ts` files in camelCase. Suffix type and constant files with `Types` and `Constants`. Hook files are named after the hook, such as `useUserFilters.ts`. Enum files are named after the enum, such as `userStatus.ts`.

## For AI agents

- Search before declaring. State which existing declaration you reused, or that none existed.
- When you use a local declaration in a second place, move it to the shared folder in the same change, and update both imports.
