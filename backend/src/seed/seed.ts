// Fills an empty database with the sample plants, assets and work orders, and one user per role.
// Run with: npm run seed

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import argon2 from 'argon2';
import { DataSource, In } from 'typeorm';
import { Asset } from '../asset/entities/asset.entity.js';
import { PASSWORD_MINIMUM_LENGTH } from '../common/constants/password.constant.js';
import { buildDatabaseOptions } from '../common/database/database-options.js';
import { Plant } from '../plant/entities/plant.entity.js';
import { User } from '../user/entities/user.entity.js';
import { WORK_ORDER_NUMBER_PREFIX } from '../work-order/constants/work-order.constant.js';
import { WorkOrder } from '../work-order/entities/work-order.entity.js';
import { WorkOrderStatus } from '../work-order/enums/work-order-status.enum.js';
import {
  DATE_LENGTH,
  FIRST_WORK_ORDER_NUMBER,
  LAYOUTS_DIRECTORY,
  MILLISECONDS_PER_DAY,
  PLANTS_FILE,
  SEED_DATA_DIRECTORY,
  SEED_MESSAGE,
  SEED_USERS,
} from './seed.constant.js';
import type { SeedAsset, SeedLayout, SeedPlant } from './seed.type.js';

const DATA_DIRECTORY = path.resolve(import.meta.dirname, '..', '..', SEED_DATA_DIRECTORY);

const readJson = async <Result>(...segments: string[]) =>
  JSON.parse(await readFile(path.join(DATA_DIRECTORY, ...segments), 'utf8')) as Result;

const toLayoutFile = (model: string) => `${model.toLowerCase().replaceAll('_', '-')}.json`;

const daysFromToday = (dayOffset: number) =>
  new Date(Date.now() + dayOffset * MILLISECONDS_PER_DAY);

let workOrderSequence = FIRST_WORK_ORDER_NUMBER;

const nextWorkOrderNumber = () => {
  workOrderSequence += 1;
  return `${WORK_ORDER_NUMBER_PREFIX}${String(workOrderSequence)}`;
};

const seedPlant = async (dataSource: DataSource, plant: SeedPlant) => {
  const layout = await readJson<SeedLayout>(LAYOUTS_DIRECTORY, toLayoutFile(plant.model));
  await dataSource.getRepository(Plant).insert({
    ...plant,
    scenery: layout.scenery.map((building) => ({
      ...building,
      position: { east: building.position.x, south: building.position.z },
    })),
  });
  for (const sample of layout.assets) {
    await seedAsset(dataSource, plant.id, sample);
  }
};

const seedAsset = async (dataSource: DataSource, plantId: string, sample: SeedAsset) => {
  const asset = await dataSource.getRepository(Asset).save({
    plantId,
    code: sample.id,
    tag: sample.tag,
    name: sample.name,
    type: sample.type,
    area: sample.area,
    status: sample.status,
    criticality: sample.criticality,
    description: sample.description,
    positionEast: sample.position.x,
    positionSouth: sample.position.z,
    rotation: sample.rotation,
    scale: sample.scale,
    specifications: sample.specifications,
    indicators: sample.indicators,
    trends: sample.trends,
    inspections: sample.inspections,
    documents: sample.documents,
    connections: sample.connections,
  });
  // The sample numbers repeat between plants, so seeded work orders are numbered in sequence.
  await dataSource.getRepository(WorkOrder).insert(
    sample.workOrders.map((workOrder) => ({
      assetId: asset.id,
      number: nextWorkOrderNumber(),
      title: workOrder.title,
      type: workOrder.type,
      status: workOrder.status,
      dueDate: daysFromToday(workOrder.dayOffset).toISOString().slice(0, DATE_LENGTH),
      completedAt:
        workOrder.status === WorkOrderStatus.COMPLETED ? daysFromToday(workOrder.dayOffset) : null,
    })),
  );
};

const seedUsers = async (dataSource: DataSource, password: string) => {
  const userRepository = dataSource.getRepository(User);
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  for (const seedUser of SEED_USERS) {
    if (await userRepository.existsBy({ email: seedUser.email })) {
      continue;
    }
    await userRepository.save(
      userRepository.create({
        email: seedUser.email,
        fullName: seedUser.fullName,
        role: seedUser.role,
        passwordHash,
        plants: await dataSource.getRepository(Plant).findBy({ id: In(seedUser.plantIds) }),
      }),
    );
  }
};

const DATABASE_URL = process.env.DATABASE_URL;
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? '';
if (!DATABASE_URL) {
  throw new Error(SEED_MESSAGE.MISSING_DATABASE_URL);
}
if (SEED_PASSWORD.length < PASSWORD_MINIMUM_LENGTH) {
  throw new Error(SEED_MESSAGE.WEAK_PASSWORD);
}

const dataSource = await new DataSource(buildDatabaseOptions(DATABASE_URL)).initialize();
try {
  if ((await dataSource.getRepository(Plant).count()) > 0) {
    console.log(SEED_MESSAGE.ALREADY_SEEDED);
  } else {
    for (const plant of await readJson<SeedPlant[]>(PLANTS_FILE)) {
      await seedPlant(dataSource, plant);
    }
  }
  await seedUsers(dataSource, SEED_PASSWORD);
  console.log(SEED_MESSAGE.DONE);
} finally {
  await dataSource.destroy();
}
