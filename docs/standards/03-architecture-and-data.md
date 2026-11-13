# 03 · Architecture, State and Data Fetching

Covers frontend structure, how state is shared, and how server data is fetched and cached.

## Architecture

The `src` folder is organised around **pages** and the **components** they use. Folder and file names follow [02](02-react-coding.md).

### Pages

- `src/pages/` holds high-level page components only, such as `Dashboard`, `Users` and `Settings`.
- A page file composes components. It MUST NOT define nested components or hold their markup. Everything a page renders beyond layout and composition lives in `src/components/`.
- Pages that belong to a group are placed in a subfolder of `pages`, named after the group in kebab-case.
- Pages that are not part of the main application flow go in `src/pages/general/`: login, sign up, not found, permission denied, and similar.

### Components

- Every component used by a page lives in `src/components/`, in a folder path that **mirrors the page's path**.
- The folder for a page is named after the page file, in kebab-case: `Users.tsx` has the folder `users/`.
- The components for that page sit inside its folder.

```
src/
  app/                          # store, providers, routing, app-wide setup
  pages/
    general/                    # login, sign up, not found, permission denied
      Login.tsx
      SignUp.tsx
      NotFound.tsx
      PermissionDenied.tsx
    dashboard/                  # group
      Users.tsx
      Settings.tsx
  components/
    general/                    # mirrors pages/general
      login/
        LoginForm.tsx
      sign-up/
        SignUpForm.tsx
      not-found/
        NotFoundMessage.tsx
    dashboard/                  # mirrors pages/dashboard
      users/                    # mirrors pages/dashboard/Users.tsx
        UsersListing.tsx
        UserTable.tsx
      settings/                 # mirrors pages/dashboard/Settings.tsx
        SettingsForm.tsx
```

- A component folder may contain further subfolders when a page's components need grouping. Subfolders are also kebab-case.
- Components used by more than one page are not yet covered by this standard.

## No unnecessary prop drilling

Passing props through components that do not use them is not allowed unless it is **extremely** necessary. Choose the lightest option that works, in this order:

1. **Local state.** Keep state in the component that uses it.
2. **Composition.** Pass the finished element as `children` or a slot prop instead of threading data through the layers in between.
3. **Context.** For values that rarely change and are read in many places, such as theme, locale or the current user.
4. **Redux store.** For shared client state that changes often or is read across pages.
5. **Server-state cache** (RTK Query or React Query). Server data MUST NOT be copied into component state, Context or the Redux store by hand.

- Props are fine when the component directly renders or uses them, or passes them to a direct child.
- Passing a prop through **more than two levels** counts as drilling. Use the options above instead.
- Do not put frequently changing values in Context, because every consumer re-renders.

## Choosing the data layer

Server data MUST be handled with one of:

- **RTK Query** (Redux Toolkit), or
- **TanStack React Query** (`@tanstack/react-query`).

Nothing else.

- A project MUST use exactly one of the two. It MUST NOT mix them.
- Server data MUST NOT be fetched ad hoc inside components or `useEffect`.
- Follow the official documentation for whichever tool is in use. Cache problems come from deviating from it.

Versions verified on 2026-11-09: `@reduxjs/toolkit` 2.14.x, `react-redux` 9.3.x, `@tanstack/react-query` 5.107.x. All support React 19.

## Generated API client

The client code for RTK Query or React Query MUST be generated from the backend's OpenAPI (Swagger) document ([10](10-backend.md)), not written by hand.

| Data layer | Generator |
|------------|-----------|
| RTK Query | `@rtk-query/codegen-openapi` (the official RTK Query generator) |
| React Query | **Orval** (`orval`), generating React Query hooks |

- Orval does not generate RTK Query code. Do not use it for RTK Query.
- Follow the current documentation of the generator in use. Read it before configuring it.
- Do not use Axios in the generated code. Configure Orval for `fetch`, as its docs describe.
- Generated code goes in one folder, `src/api/generated/`. It is **never edited by hand**. Regenerate it whenever the backend's API changes, and commit the result with the change that caused it.
- Generated file and folder names are set by the tool and are exempt from the naming rules in [02](02-react-coding.md). The folder is also excluded from lint.
- Anything the generator cannot express is added **outside** the generated folder. For RTK Query, add `providesTags` and `invalidatesTags` through `enhanceEndpoints`, as the generator's docs describe. For React Query, wrap generated hooks and add invalidation in a custom hook. The caching and invalidation rules below still apply in full.
- Generator configuration files sit at the project root.

Versions verified on 2026-11-09: `orval` 8.47.x (Node `>=22.18.0`, satisfied by our Node 24 minimum), `@rtk-query/codegen-openapi` 2.2.x.

## RTK Query

Follow the [RTK Query documentation](https://redux-toolkit.js.org/rtk-query/overview).

### API setup

- Define one `createApi` per backend base URL, in `src/app/`. Do not create one per page.
- Every API MUST define a `baseQuery`, normally `fetchBaseQuery`, with `baseUrl` taken from a constant or environment variable. If the project needs auth headers or token refresh, wrap the base query. Do not repeat that logic in endpoints.
- Every API MUST declare `tagTypes`. Tag names are an enum (see [02](02-react-coding.md)):

```ts
enum ApiTagType {
  USER = 'USER',
  ORDER = 'ORDER',
}
```

- Add endpoints per page or page group with `api.injectEndpoints`. Do not define every endpoint in one file.
- Export the generated hooks from the file that defines the endpoints, and use them in components.
- Register the API's `reducer` and `middleware` in the store. Without the middleware, caching, invalidation and polling do not work.

### Caching and invalidation

- Every **query** endpoint MUST have `providesTags`. Every **mutation** endpoint that changes data MUST have `invalidatesTags`.
- Tags MUST be specific. Provide a list tag and an item tag per entity:

```ts
providesTags: (result) =>
  result
    ? [
        ...result.map(({ id }) => ({ type: ApiTagType.USER, id })),
        { type: ApiTagType.USER, id: LIST_TAG_IDENTIFIER },
      ]
    : [{ type: ApiTagType.USER, id: LIST_TAG_IDENTIFIER }],
```

- A mutation MUST invalidate every tag whose data it changes. Missing invalidation leaves stale data on screen.
- Do not use broad invalidation of a whole tag type when one item or list is enough.
- Set cache behaviour (`keepUnusedDataFor`, `refetchOnMountOrArgChange`, `refetchOnFocus`) with named constants. Do not hold cached server data in a separate slice.
- Shape API responses with `transformResponse`, not in components.
- Use `skip` for queries that depend on a value that is not available yet.

## React Query

Applies when the project uses React Query instead of RTK Query. Follow the [TanStack Query documentation](https://tanstack.com/query/latest).

- Create one `QueryClient` and provide it once at the app root. Set default options (`staleTime`, `retry`) there using named constants.
- Query keys MUST come from a **query key factory** per page or page group. Do not write key arrays inline:

```ts
const userQueryKeys = {
  all: [QueryKeyScope.USER] as const,
  list: () => [...userQueryKeys.all, QueryKeyScope.LIST] as const,
  detail: (userId: string) => [...userQueryKeys.all, QueryKeyScope.DETAIL, userId] as const,
};
```

- Define queries with `queryOptions` and reuse them across hooks and prefetching.
- Every mutation MUST invalidate the affected keys in `onSuccess` (or `onSettled`) using `queryClient.invalidateQueries`. Invalidate the narrowest key that is correct.
- Wrap queries and mutations in custom hooks. Components do not call `useQuery` or `useMutation` with raw keys and functions.
- Do not copy query data into `useState` or a store.

## For AI agents

- Before passing a prop more than two levels, apply the options in "No unnecessary prop drilling" and say which you chose.
- When adding an endpoint or mutation, add its tags (RTK Query) or key and invalidation (React Query) in the same change.
- Do not introduce a second data-fetching library. Use the one the project already has.
