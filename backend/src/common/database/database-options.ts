import type { DataSourceOptions } from 'typeorm';
import { Asset } from '../../asset/entities/asset.entity.js';
import { AuthSession } from '../../auth/entities/auth-session.entity.js';
import { RefreshToken } from '../../auth/entities/refresh-token.entity.js';
import { Plant } from '../../plant/entities/plant.entity.js';
import { User } from '../../user/entities/user.entity.js';
import { WorkOrder } from '../../work-order/entities/work-order.entity.js';
import { SnakeCaseNamingStrategy } from './snake-case-naming.strategy.js';

const DATABASE_TYPE = 'postgres';

/** The one description of the database, shared by the app and the migration CLI. */
export const buildDatabaseOptions = (databaseUrl: string): DataSourceOptions => ({
  type: DATABASE_TYPE,
  url: databaseUrl,
  entities: [User, Plant, Asset, WorkOrder, AuthSession, RefreshToken],
  migrations: [`${import.meta.dirname}/../../migrations/*.js`],
  namingStrategy: new SnakeCaseNamingStrategy(),
  // gen_random_uuid() is built into PostgreSQL, so no extension has to be installed.
  uuidExtension: 'pgcrypto',
  // The schema only ever changes through migrations.
  synchronize: false,
  migrationsRun: false,
});
