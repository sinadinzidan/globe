# 02 · React Coding Standards

Covers coding conventions for React frontend code. This file grows as rules are added.

## File and folder naming

| What | Convention | Example |
|------|-----------|---------|
| `.tsx` files | PascalCase | `UserProfile.tsx` |
| `.ts` files | camelCase | `formatDate.ts` |
| Folders | kebab-case | `user-profile/` |

- All three rules are **MUST**.
- Folder names are kebab-case at every level, with no exceptions for component folders. A folder holding `UserProfile.tsx` is named `user-profile/`, not `UserProfile/`.
- Name a file after its main export where it has one.

### Exceptions

Files whose name is required by a tool or framework keep that name, since renaming them breaks the tool:

- Tool configuration files, such as `vite.config.ts` and `vite-env.d.ts`.
- Code produced by a generator, in `src/api/generated/` (see [03](03-architecture-and-data.md)).
- Any other file the toolchain requires under a fixed name.

Do not add an exception for convenience. If a file is not dictated by a tool, it follows the table above.

### Examples

Correct:

```
src/
  user-profile/
    UserProfile.tsx
    formatUserName.ts
```

Incorrect:

```
src/
  UserProfile/              # folder must be kebab-case
    user-profile.tsx        # .tsx must be PascalCase
    FormatUserName.ts       # .ts must be camelCase
```

## Variable naming

- Names MUST be full words that describe what they hold. Abbreviations are not allowed.
- This applies to variables, parameters, properties, functions and type names.
- Single-letter names (`i`, `e`, `x`) are not allowed, including in loops and callbacks.
- Acronyms in common use (`id`, `url`, `html`, `api`, `http`) are allowed because they are the full name in practice.

| Incorrect | Correct |
|-----------|---------|
| `usr`, `btn`, `cfg` | `user`, `button`, `configuration` |
| `idx`, `i` | `index`, `userIndex` |
| `err`, `e` | `error`, `changeEvent` |
| `res`, `req` | `response`, `request` |

### Booleans

A boolean MUST carry a prefix that makes it read as a yes/no question. Allowed prefixes:

| Prefix | Use for | Example |
|--------|---------|---------|
| `is` | state | `isLoading`, `isVisible` |
| `has` | possession | `hasError`, `hasPermission` |
| `can` | ability | `canSubmit`, `canEdit` |
| `should` | intent | `shouldRetry`, `shouldRedirect` |
| `did` / `will` | past / future event | `didMount`, `willExpire` |

- Use the positive form. Write `isEnabled`, not `isNotDisabled`.
- The same applies to boolean props, state variables and function return values.

## Enums

- Use enums wherever a value comes from a fixed set. Do not use string or number unions, or plain objects, in their place.
- The enum **name** is PascalCase.
- Both enum **keys** and enum **values** MUST be fully capitalised, with words separated by underscores (`UPPER_SNAKE_CASE`).
- The value MUST equal the key.
- Enums MUST use the TypeScript `enum` keyword with string values. Numeric enums are not allowed.

Correct:

```ts
enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  SUSPENDED = 'SUSPENDED',
}
```

Incorrect:

```ts
enum UserStatus {
  Active = 'active',                    // key and value must be UPPER_SNAKE_CASE
  PENDING_APPROVAL = 'pending-approval' // value must equal the key
}
```

### Project configuration

The TypeScript `enum` keyword is not erasable syntax. The Vite React-TypeScript template may set `erasableSyntaxOnly` to `true`, which rejects enums. Projects MUST set it to `false` (or remove it) in `tsconfig.app.json` and `tsconfig.node.json`.

## No magic values

- Numbers and strings MUST NOT appear inline in code as meaningful values. Name them.
- Use an enum when the value belongs to a fixed set. Otherwise use a named constant.
- Constants are named in `UPPER_SNAKE_CASE`, and live in a `.ts` file, not inline in a component.
- This covers: numbers (timeouts, limits, sizes, status codes), strings (routes, storage keys, event names, class names, API paths, user-facing messages), and any literal that is compared against.

Correct:

```ts
const MAXIMUM_RETRY_COUNT = 3;
const REQUEST_TIMEOUT_MILLISECONDS = 5000;

if (retryCount > MAXIMUM_RETRY_COUNT) { ... }
if (user.status === UserStatus.SUSPENDED) { ... }
```

Incorrect:

```ts
if (retryCount > 3) { ... }
if (user.status === 'suspended') { ... }
setTimeout(refresh, 5000);
```

Allowed without naming: `0`, `1` and `-1` as plain arithmetic or index values, and empty string `''`, where the meaning is obvious from context.

## Component structure

Inside a component, code is arranged in **logical groups**. Similar things sit together, each group is separated from the next by one blank line, and groups never interleave.

### Order

Place groups in this order, skipping any the component does not need:

1. **Hooks from libraries and custom hooks**: router, store, data-fetching, translation, and your own custom hooks (`useNavigate`, `useAppSelector`, `useGetUsersQuery`, `useUserPermissions`).
2. **State**: all `useState` and `useReducer` calls.
3. **Refs**: all `useRef` calls.
4. **Derived values**: computed values and `useMemo`.
5. **Handlers**: event handlers and helper functions, including `useCallback`.
6. **Effects**: all `useEffect` calls, placed **immediately before the `return`**.
7. **Return**: the JSX.

### Rules

- Every group is separated by exactly one blank line. Related lines inside a group have no blank lines between them.
- All `useState` calls are together. Do not scatter them between handlers or effects.
- All `useEffect` calls are together, directly above the `return`. Do not place an effect in the middle of the component.
- Keep handlers together. Do not mix them with state, refs or effects.
- Do not wrap a function in `useCallback`, or a value in `useMemo`, unless it is required, for example when it is a dependency of an effect or is passed to a memoised child. Otherwise write a plain function.
- If a group becomes large or reusable, extract it into a custom hook rather than lengthening the component.

### Example

Correct:

```tsx
const UserList = ({ departmentIdentifier }: UserListProperties) => {
  const navigate = useNavigate();
  const { data: users, isLoading } = useGetUsersQuery(departmentIdentifier);
  const { canEdit } = useUserPermissions();

  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const searchInputReference = useRef<HTMLInputElement>(null);

  const filteredUsers = users?.filter((user) => user.name.includes(searchText));

  const handleSearchChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setSearchText(changeEvent.target.value);
  };

  const handleUserSelect = (userIdentifier: string) => {
    navigate(`${ROUTE_PATH.USERS}/${userIdentifier}`);
  };

  useEffect(() => {
    searchInputReference.current?.focus();
  }, []);

  return (...);
};
```

Incorrect: state declared after a handler, an effect in the middle, no blank lines between groups.

```tsx
const UserList = ({ departmentIdentifier }: UserListProperties) => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  useEffect(() => { ... }, []);
  const handleSearchChange = (changeEvent) => { ... };
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: users } = useGetUsersQuery(departmentIdentifier);
  return (...);
};
```
