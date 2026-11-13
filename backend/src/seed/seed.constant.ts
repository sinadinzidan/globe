import { Role } from '../common/enums/role.enum.js';

export const SEED_DATA_DIRECTORY = 'seed-data';
export const PLANTS_FILE = 'plants.json';
export const LAYOUTS_DIRECTORY = 'plant-layouts';
export const MILLISECONDS_PER_DAY = 86_400_000;
export const DATE_LENGTH = 10;
/** Seeded work orders are numbered upwards from here, below the range new ones are drawn from. */
export const FIRST_WORK_ORDER_NUMBER = 400_000;

export const SEED_MESSAGE = {
  MISSING_DATABASE_URL: 'DATABASE_URL must be set to seed the database.',
  WEAK_PASSWORD: 'SEED_PASSWORD must be set to at least 12 characters to seed users.',
  ALREADY_SEEDED: 'Plants are already present. Nothing was changed.',
  DONE: 'Seeding finished.',
} as const;

interface SeedUser {
  email: string;
  fullName: string;
  role: Role;
  /** Plants to assign. Roles that reach every plant need none. */
  plantIds: string[];
}

/** One account for each role, so every level of access can be tried out. */
export const SEED_USERS: readonly SeedUser[] = [
  {
    email: 'administrator@globe.example',
    fullName: 'Amal Administrator',
    role: Role.ADMINISTRATOR,
    plantIds: [],
  },
  {
    email: 'plant.manager@globe.example',
    fullName: 'Majid Manager',
    role: Role.PLANT_MANAGER,
    plantIds: ['habshan-gas-complex', 'habshan-5', 'bab-gas-plant'],
  },
  {
    email: 'reliability.engineer@globe.example',
    fullName: 'Reem Reliability',
    role: Role.RELIABILITY_ENGINEER,
    plantIds: [],
  },
  {
    email: 'maintenance.planner@globe.example',
    fullName: 'Mariam Planner',
    role: Role.MAINTENANCE_PLANNER,
    plantIds: ['habshan-gas-complex', 'asab-gas-plant'],
  },
  {
    email: 'inspector@globe.example',
    fullName: 'Ibrahim Inspector',
    role: Role.INSPECTOR,
    plantIds: ['das-island-lng', 'ruwais-ngl'],
  },
  {
    email: 'operator@globe.example',
    fullName: 'Omar Operator',
    role: Role.OPERATOR,
    plantIds: ['habshan-gas-complex'],
  },
  {
    email: 'viewer@globe.example',
    fullName: 'Vera Viewer',
    role: Role.VIEWER,
    plantIds: ['ruwais-refinery', 'borouge-ruwais'],
  },
];
