import { Permission } from '../enums/permission.enum.js';
import { Role } from '../enums/role.enum.js';

const READ_PLANT_AND_ASSET = [Permission.PLANT_READ, Permission.ASSET_READ];

/**
 * The permissions of each role. This is the single place that decides what a role may do.
 * A role without `PLANT_READ_ALL` only reaches the plants the user has been assigned.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.ADMINISTRATOR]: Object.values(Permission),
  [Role.PLANT_MANAGER]: [
    ...READ_PLANT_AND_ASSET,
    Permission.ASSET_PERFORMANCE_READ,
    Permission.ASSET_INSPECTION_READ,
    Permission.ASSET_DOCUMENT_READ,
    Permission.WORK_ORDER_READ,
    Permission.WORK_ORDER_CREATE,
    Permission.WORK_ORDER_UPDATE_ANY,
    Permission.USER_READ,
    Permission.ROLE_READ,
  ],
  [Role.RELIABILITY_ENGINEER]: [
    ...READ_PLANT_AND_ASSET,
    Permission.PLANT_READ_ALL,
    Permission.ASSET_PERFORMANCE_READ,
    Permission.ASSET_INSPECTION_READ,
    Permission.ASSET_DOCUMENT_READ,
    Permission.WORK_ORDER_READ,
    Permission.WORK_ORDER_CREATE,
    Permission.WORK_ORDER_UPDATE_OWN,
  ],
  [Role.MAINTENANCE_PLANNER]: [
    ...READ_PLANT_AND_ASSET,
    Permission.ASSET_DOCUMENT_READ,
    Permission.WORK_ORDER_READ,
    Permission.WORK_ORDER_CREATE,
    Permission.WORK_ORDER_UPDATE_ANY,
  ],
  [Role.INSPECTOR]: [
    ...READ_PLANT_AND_ASSET,
    Permission.ASSET_INSPECTION_READ,
    Permission.ASSET_DOCUMENT_READ,
    Permission.WORK_ORDER_READ,
    Permission.WORK_ORDER_CREATE,
    Permission.WORK_ORDER_UPDATE_OWN,
  ],
  [Role.OPERATOR]: [
    ...READ_PLANT_AND_ASSET,
    Permission.ASSET_PERFORMANCE_READ,
    Permission.WORK_ORDER_READ,
    Permission.WORK_ORDER_CREATE,
    Permission.WORK_ORDER_UPDATE_OWN,
  ],
  [Role.VIEWER]: READ_PLANT_AND_ASSET,
};
