import { Policy } from '@nestjs/authorization';
import { Permission } from '../common/enums/permission.enum.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { canAccessPlant, hasPermission } from '../common/utilities/permission.utility.js';

@Policy()
export class PlantPolicy {
  read(user: AuthenticatedUser | null) {
    return hasPermission(user, Permission.PLANT_READ);
  }

  readAll(user: AuthenticatedUser | null) {
    return (
      hasPermission(user, Permission.PLANT_READ) && hasPermission(user, Permission.PLANT_READ_ALL)
    );
  }

  /** One particular plant: either every plant is open to the user, or this one is assigned. */
  readOne(user: AuthenticatedUser | null, plantId: string) {
    return canAccessPlant(user, plantId);
  }
}
