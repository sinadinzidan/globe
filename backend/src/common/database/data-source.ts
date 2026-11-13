import { DataSource } from 'typeorm';
import { buildDatabaseOptions } from './database-options.js';

const MISSING_DATABASE_URL_MESSAGE = 'DATABASE_URL must be set to run migrations.';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(MISSING_DATABASE_URL_MESSAGE);
}

/** The data source the TypeORM CLI uses for migrations. The app builds its own. */
export default new DataSource(buildDatabaseOptions(DATABASE_URL));
