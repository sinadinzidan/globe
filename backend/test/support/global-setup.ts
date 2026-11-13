import { DataSource } from 'typeorm';
import { buildDatabaseOptions } from '../../src/common/database/database-options.js';

const RESET_SCHEMA_SQL = 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;';
const MISSING_DATABASE_URL_MESSAGE =
  'Set TEST_DATABASE_URL to a PostgreSQL database for tests. Everything in it is deleted.';

/** Rebuilds the test database from the migrations before the test files run. */
export default async function setUpTestDatabase() {
  const databaseUrl = process.env.TEST_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(MISSING_DATABASE_URL_MESSAGE);
  }
  const dataSource = await new DataSource({
    ...buildDatabaseOptions(databaseUrl),
    migrations: [`${import.meta.dirname}/../../src/migrations/*.ts`],
  }).initialize();
  await dataSource.query(RESET_SCHEMA_SQL);
  await dataSource.runMigrations();
  await dataSource.destroy();
}
