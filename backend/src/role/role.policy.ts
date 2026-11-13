import { Policy } from '@nestjs/authorization';
import { Permission } from '../common/enums/permission.enum.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { hasPermission } from '../common/utilities/permission.utility.js';

@Policy()
export class RolePolicy {
  read(user: AuthenticatedUser | null) {
    return hasPermission(user, Permission.ROLE_READ);
  }
}
