# Globe API

The backend of Globe: NestJS, TypeORM and PostgreSQL. It signs users in, decides what each role
may do, and serves the plants, assets and work orders.

The setup, the roles and the security model are described in the [project README](../README.md).

| Script                                              | Purpose                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------- |
| `npm run start:dev`                                 | Start the API with reload, reading `.env`                           |
| `npm run migration:run`                             | Apply pending migrations                                            |
| `npm run migration:revert`                          | Undo the last migration                                             |
| `npm run migration:generate -- src/migrations/Name` | Draft a migration from entity changes. Review it before committing. |
| `npm run seed`                                      | Fill an empty database with sample data and one user per role       |
| `npm run openapi:export`                            | Write `openapi.json`, from which the web client is generated        |
| `npm run test:e2e`                                  | Run the security and access tests against a test database           |
| `npm run lint`, `typecheck`, `format:check`         | The checks CI runs                                                  |

Each feature is a module under `src/`: `auth`, `user`, `role`, `plant`, `asset` and `work-order`.
Code shared between modules is in `src/common/`.
