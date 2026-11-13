import { Permission } from '../enums/permission.enum.js';
import type { AuthenticatedUser } from '../types/authenticated-user.type.js';

/** Whether a user holds a permission. A guest holds none. */
export const hasPermission = (user: AuthenticatedUser | null, permission: Permission) =>
  Boolean(user?.permissions.includes(permission));

/** Whether a user may reach a plant: either every plant, or one they are assigned to. */
export const canAccessPlant = (user: AuthenticatedUser | null, plantId: string) =>
  hasPermission(user, Permission.PLANT_READ) &&
  (hasPermission(user, Permission.PLANT_READ_ALL) || Boolean(user?.plantIds.includes(plantId)));
