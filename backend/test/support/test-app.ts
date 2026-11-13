import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import argon2 from 'argon2';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { DataSource } from 'typeorm';
import { AssetCriticality } from '../../src/asset/enums/asset-criticality.enum.js';
import { AssetStatus } from '../../src/asset/enums/asset-status.enum.js';
import { AssetType } from '../../src/asset/enums/asset-type.enum.js';
import { Asset } from '../../src/asset/entities/asset.entity.js';
import { CSRF_HEADER_NAME, CSRF_HEADER_VALUE } from '../../src/common/constants/api.constant.js';
import { Role } from '../../src/common/enums/role.enum.js';
import { Plant } from '../../src/plant/entities/plant.entity.js';
import { Emirate } from '../../src/plant/enums/emirate.enum.js';
import { PlantModel } from '../../src/plant/enums/plant-model.enum.js';
import { PlantSector } from '../../src/plant/enums/plant-sector.enum.js';
import { User } from '../../src/user/entities/user.entity.js';

export const TEST_PASSWORD = 'correct horse battery staple';
export const ASSIGNED_PLANT_ID = 'alpha-plant';
export const OTHER_PLANT_ID = 'beta-plant';
export const ASSET_CODE = 'p-101';

const TRUNCATE_SQL =
  'TRUNCATE TABLE "work_order", "asset", "refresh_token", "auth_session", "user_plant", "user", "plant" CASCADE';

/** Emails of the fixture users. Every role except the two that reach all plants is assigned the first plant only. */
export const TEST_EMAIL: Record<Role, string> = {
  [Role.ADMINISTRATOR]: 'administrator@test.example',
  [Role.PLANT_MANAGER]: 'manager@test.example',
  [Role.RELIABILITY_ENGINEER]: 'engineer@test.example',
  [Role.MAINTENANCE_PLANNER]: 'planner@test.example',
  [Role.INSPECTOR]: 'inspector@test.example',
  [Role.OPERATOR]: 'operator@test.example',
  [Role.VIEWER]: 'viewer@test.example',
};

export type TestApp = INestApplication<App>;

/** Starts the app exactly as `main.ts` does, on the test database. */
export const createTestApp = async (): Promise<TestApp> => {
  const { AppModule } = await import('../../src/app.module.js');
  const { setUpApp } = await import('../../src/app.setup.js');
  const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleFixture.createNestApplication<TestApp>();
  setUpApp(app);
  await app.init();
  return app;
};

const buildPlant = (id: string): Partial<Plant> => ({
  id,
  name: id,
  operator: 'Test operator',
  sector: PlantSector.POWER_AND_WATER,
  emirate: Emirate.ABU_DHABI,
  longitude: 54,
  latitude: 24,
  description: 'A plant for tests.',
  model: PlantModel.POWER_AND_WATER_PLANT,
  scenery: [],
});

const buildAsset = (plantId: string): Partial<Asset> => ({
  plantId,
  code: ASSET_CODE,
  tag: 'P-101',
  name: 'Test pump',
  type: AssetType.PUMP,
  area: 'Test area',
  status: AssetStatus.RUNNING,
  criticality: AssetCriticality.HIGH,
  description: 'A pump for tests.',
  positionEast: 0,
  positionSouth: 0,
});

/** Empties the database and puts back two plants, an asset in each, and one user per role. */
export const resetFixtures = async (app: TestApp) => {
  const dataSource = app.get(DataSource);
  await dataSource.query(TRUNCATE_SQL);
  const plants = await dataSource
    .getRepository(Plant)
    .save([buildPlant(ASSIGNED_PLANT_ID), buildPlant(OTHER_PLANT_ID)]);
  await dataSource
    .getRepository(Asset)
    .save([buildAsset(ASSIGNED_PLANT_ID), buildAsset(OTHER_PLANT_ID)]);
  const passwordHash = await argon2.hash(TEST_PASSWORD, { type: argon2.argon2id });
  const userRepository = dataSource.getRepository(User);
  await userRepository.save(
    Object.values(Role).map((role) =>
      userRepository.create({
        email: TEST_EMAIL[role],
        fullName: `Test ${role}`,
        role,
        passwordHash,
        plants: plants.filter((plant) => plant.id === ASSIGNED_PLANT_ID),
      }),
    ),
  );
};

/** A request that carries the header every state-changing request needs. */
export const api = (app: TestApp) => ({
  get: (path: string) => request(app.getHttpServer()).get(path),
  post: (path: string) =>
    request(app.getHttpServer()).post(path).set(CSRF_HEADER_NAME, CSRF_HEADER_VALUE),
  patch: (path: string) =>
    request(app.getHttpServer()).patch(path).set(CSRF_HEADER_NAME, CSRF_HEADER_VALUE),
  delete: (path: string) =>
    request(app.getHttpServer()).delete(path).set(CSRF_HEADER_NAME, CSRF_HEADER_VALUE),
});

export interface SignedIn {
  /** `name=value` pairs, ready for a `Cookie` header. */
  cookies: string[];
  accessCookie: string;
  refreshCookie: string;
  /** The raw `Set-Cookie` headers, with their attributes. */
  setCookieHeaders: string[];
}

const toCookiePair = (setCookieHeader: string) => setCookieHeader.split(';')[0] ?? '';

export const readCookies = (setCookieHeaders: string[] | undefined): SignedIn => {
  const headers = setCookieHeaders ?? [];
  const cookies = headers.map((header) => toCookiePair(header));
  return {
    cookies,
    accessCookie: cookies.find((cookie) => cookie.startsWith('globe_access=')) ?? '',
    refreshCookie: cookies.find((cookie) => cookie.startsWith('globe_refresh=')) ?? '',
    setCookieHeaders: headers,
  };
};

export const signIn = async (app: TestApp, role: Role, password = TEST_PASSWORD) => {
  const response = await api(app)
    .post('/api/auth/login')
    .send({ email: TEST_EMAIL[role], password });
  expect(response.status).toBe(204);
  return readCookies(response.get('Set-Cookie'));
};
