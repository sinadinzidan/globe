# 10 · Backend: NestJS, TypeORM and PostgreSQL

Covers the backend stack, its architecture, database and migration rules, naming, security and API documentation.

## Stack

- **NestJS**, **TypeORM** (`@nestjs/typeorm`) and **PostgreSQL** (`pg` driver). Use the latest stable versions and follow their **current documentation**: <https://docs.nestjs.com> and <https://typeorm.io>. Read the docs before setting up or changing anything. Do not write from memory of an older version.
- API documentation with **Swagger** (`@nestjs/swagger`).

Versions verified on 2026-11-09:

| Package | Latest | Requires |
|---------|--------|----------|
| `@nestjs/core` | 12.4.x | Node `>=20` |
| `@nestjs/typeorm` | 12.0.x | TypeORM `^0.3` or `^1.0` |
| `typeorm` | 1.1.x | Node `^20.19.0 \|\| ^22.13.0 \|\| >=24.11.0` |
| `@nestjs/swagger` | 12.1.x | |
| `pg` | 8.23.x | |

**Backend Node minimum is `24.11.0`**, because TypeORM requires `>=24.11.0` on the Node 24 line. This is higher than the frontend minimum (`24.0.0`, see [01](01-frontend.md)). Set it in `engines`, `.nvmrc` and CI, and enforce it with `engine-strict=true`.

## Architecture: one module per feature

Follow the NestJS module architecture. Each feature is a folder under `src/` that owns everything it needs:

```
src/
  user/
    user.module.ts
    user.controller.ts
    user.service.ts
    entities/
      user.entity.ts
    dto/
      create-user.dto.ts
      update-user.dto.ts
    enums/
    constants/
    types/
  order/                        # a module with several controllers and services
    order.module.ts
    controllers/
      order.controller.ts
      order-item.controller.ts
    services/
      order.service.ts
      order-item.service.ts
    entities/
    dto/
  common/                       # code shared by more than one module
```

### Module folder rules

- **Names are singular.** Module folders, entity classes and database tables are all singular: `user`, not `users`; table `user`, not `users`.
- A module with one controller and one service keeps them at the module's top level. With **more than one controller**, put them in a `controllers/` folder. With **more than one service**, put them in a `services/` folder.
- Create `entities/`, `dto/`, `enums/`, `constants/` and `types/` folders in a module when it needs them. A single small file may stay at the module's top level.
- `user` and `order` are reserved words in PostgreSQL. TypeORM quotes identifiers itself, but any hand-written SQL, including in migrations, MUST quote them.

- Files follow the NestJS naming convention (`name.type.ts`, kebab-case, such as `user-profile.service.ts`). This is the backend exception to the camelCase `.ts` rule in [02](02-react-coding.md), because the NestJS tooling and docs use it. Folders stay kebab-case.
- A module exposes what others need through `exports`, and imports other modules. It does not reach into another module's files.
- Code used by more than one module goes in `src/common/`. Code used by one module stays in it.

### Controllers

- Controllers contain **no business logic**. They only: define routes, accept and validate input through DTOs, call one service method, and return the result.
- Every controller method is short and calls the service. Decisions, calculations, database access and orchestration belong in the service.

### Services

- All business logic lives in services. Services use injected repositories for database access.
- Split a service method into small private methods, each doing one clear thing. Name them for what they do.
- **Utility functions** (pure helpers with no dependency on the service) go in a separate utility file, not inside the service. Anything reusable by other code goes in `common/`.
- A method that has grown large MUST be split. Aim for a method short enough to read without scrolling (about 30 lines is a guide, not a limit). A reader should understand it from the names of the methods it calls.
- **Check before you declare.** Search for an existing function, DTO, enum or constant before creating one. Never create a duplicate. Reuse or extend what exists.

## Coding standard

The naming and constants rules in [02](02-react-coding.md) apply to the backend too:

- Names are full words, no abbreviations, no single-letter names.
- Booleans carry a prefix: `is`, `has`, `can`, `should`, `did`, `will`.
- Enums use the TypeScript `enum` keyword. Keys and string values are `UPPER_SNAKE_CASE`, and the value equals the key.
- No magic numbers or strings. Use enums or named `UPPER_SNAKE_CASE` constants (limits, timeouts, error messages, route paths, table names, role names).
- Code is `camelCase`. Classes and enum names are `PascalCase`.

## Types, constants and enums

The same rules as the frontend ([04](04-types-constants-hooks.md)) apply:

- Search for an existing type, constant or enum before declaring one.
- Used in one file only: declare it in that file.
- Used by more than one file in the same module: move it to the module's `types/`, `constants/` or `enums/` folder.
- Used by more than one module: move it to the matching folder in `src/common/`.

## Database

### Naming

- In code and in the ORM, names are **camelCase**: entity properties, repository fields, DTO fields.
- In the database, names are **snake_case**: tables, columns, indexes, constraints.
- TypeORM maps between them, so code only ever sees camelCase. Configure this **once**, with a project-owned naming strategy set on the data source. Do not hand-write a column name on every property.
- The community package `typeorm-naming-strategies` was last updated in 2022 and does not support TypeORM 1.x. Do not use it.
- Where a database name cannot come from the strategy, set it explicitly (`name`) so the property stays camelCase in code and snake_case in the database.

### Migrations

- **`synchronize` MUST be `false`** in every environment, always. Schema changes are made only through migration files.
- Generate migrations with the TypeORM CLI from entity changes, then **review and edit them**. Never commit an unreviewed generated migration.
- Every migration MUST have a working `down`.
- Never edit a migration that has been applied or merged. Add a new one.
- One purpose per migration, with a descriptive name.
- Migrations run as an explicit deploy step, not as a side effect of the app starting in production.
- Make changes safe for live data. Do not drop or rename a column or table in one step while the app still uses it: add the new structure, move the data, switch the code, then remove the old structure in a later migration. Back up before destructive changes.

### Schema and query practices

- Use PostgreSQL types that fit the data: `uuid` or identity keys, `timestamptz` for timestamps, `numeric` for money, `boolean`, `jsonb` only where the structure really is flexible.
- Declare foreign keys, unique constraints and `NOT NULL` where the data requires them. The database enforces integrity, not only the code.
- Index columns used in lookups, joins and filters, including foreign keys.
- Wrap multi-step writes in a **transaction**.
- Select only the columns needed. Paginate list endpoints. Avoid N+1 queries by loading relations deliberately.
- Always use the query builder or repository methods with parameters. **Never** build SQL by concatenating input.

## Security

Be mindful of vulnerabilities in everything written, and follow the OWASP guidance.

- **Validate all input.** Use DTOs with `class-validator` and a global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true` and `transform: true`.
- **Never return entities directly.** Return response DTOs or serialised output, so fields such as password hashes or internal flags never leak.
- **Authentication and authorisation** on every route that needs them, through guards. Deny by default. Check ownership and permissions in the service, not only roles.
- **Passwords** are hashed with a current, slow algorithm (Argon2 or bcrypt). Never store or log plain text.
- **Secrets and configuration** come from environment variables through `@nestjs/config`, validated at startup. Never commit secrets or put them in code.
- Set secure HTTP headers (`helmet`), a restrictive CORS policy, and **rate limiting** (`@nestjs/throttler`), with stricter limits on login and similar routes.
- Error responses MUST NOT expose stack traces, SQL or internal details. Log the detail, return a safe message.
- Do not log sensitive data (passwords, tokens, personal data).
- Keep dependencies current and run `npm audit`. Do not add a dependency without need.

## API documentation: Swagger

- Swagger is set up with `@nestjs/swagger` and follows its current documentation.
- **Every backend change that touches the API updates the Swagger documentation in the same change.** This covers new, changed or removed endpoints, DTOs, enums, responses, status codes, authentication and permission requirements. A change that leaves Swagger out of date is not done.
- The OpenAPI document is the source of truth for the frontend's generated API client (see [03](03-architecture-and-data.md)). An out-of-date or inaccurate Swagger document produces a wrong client, so accuracy is mandatory.
- Every controller has `@ApiTags`. Every endpoint has `@ApiOperation`, plus `@ApiResponse` for the success case and each error it can return. Protected endpoints have `@ApiBearerAuth` (or the matching scheme).
- Every DTO property has `@ApiProperty` (or `@ApiPropertyOptional`) with type, description and an example where useful.
- The documentation UI is not exposed publicly in production unless it is deliberately protected.

## For AI agents

- Read the current NestJS and TypeORM docs before writing code.
- Put business logic in services only. Keep controllers thin. Split large methods and move utilities out of services.
- Search for existing code before creating any function, DTO, enum or constant.
- For any schema change, write a reviewed migration with a `down`. Never set `synchronize: true`.
- Update Swagger in the same change as the endpoint.
- Check the change against the security section before reporting it done.
