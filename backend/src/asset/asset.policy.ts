import { Policy } from '@nestjs/authorization';
import { Permission } from '../common/enums/permission.enum.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { hasPermission } from '../common/utilities/permission.utility.js';

/** What a user may see of an asset. Access to the asset's plant is checked separately. */
@Policy()
export class AssetPolicy {
  read(user: AuthenticatedUser | null) {
    return hasPermission(user, Permission.ASSET_READ);
  }

  readPerformance(user: AuthenticatedUser | null) {
    return (
      hasPermission(user, Permission.ASSET_READ) &&
      hasPermission(user, Permission.ASSET_PERFORMANCE_READ)
    );
  }

  readInspections(user: AuthenticatedUser | null) {
    return (
      hasPermission(user, Permission.ASSET_READ) &&
      hasPermission(user, Permission.ASSET_INSPECTION_READ)
    );
  }

  readDocuments(user: AuthenticatedUser | null) {
    return (
      hasPermission(user, Permission.ASSET_READ) &&
      hasPermission(user, Permission.ASSET_DOCUMENT_READ)
    );
  }
}
