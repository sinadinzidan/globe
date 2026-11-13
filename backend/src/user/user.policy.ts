import { Policy } from '@nestjs/authorization';
import { Permission } from '../common/enums/permission.enum.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { hasPermission } from '../common/utilities/permission.utility.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';

@Policy()
export class UserPolicy {
  read(user: AuthenticatedUser | null) {
    return hasPermission(user, Permission.USER_READ);
  }

  manage(user: AuthenticatedUser | null) {
    return hasPermission(user, Permission.USER_MANAGE);
  }

  /**
   * Managing a particular user. Nobody may change their own role or deactivate their own
   * account, so an administrator cannot lock themselves out or quietly keep access.
   */
  update(user: AuthenticatedUser | null, targetUserId: string, changes: UpdateUserDto) {
    const isChangingOwnAccess =
      user?.id === targetUserId && (changes.role !== undefined || changes.isActive !== undefined);
    return hasPermission(user, Permission.USER_MANAGE) && !isChangingOwnAccess;
  }
}
