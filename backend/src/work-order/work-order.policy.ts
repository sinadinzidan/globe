import { Policy } from '@nestjs/authorization';
import { Permission } from '../common/enums/permission.enum.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { hasPermission } from '../common/utilities/permission.utility.js';
import type { WorkOrder } from './entities/work-order.entity.js';

@Policy()
export class WorkOrderPolicy {
  read(user: AuthenticatedUser | null) {
    return hasPermission(user, Permission.WORK_ORDER_READ);
  }

  create(user: AuthenticatedUser | null) {
    return hasPermission(user, Permission.WORK_ORDER_CREATE);
  }

  /** Whether the user may change work orders at all. The route checks this before loading one. */
  updateSome(user: AuthenticatedUser | null) {
    return (
      hasPermission(user, Permission.WORK_ORDER_UPDATE_ANY) ||
      hasPermission(user, Permission.WORK_ORDER_UPDATE_OWN)
    );
  }

  /** One particular work order: any of them with the wider permission, otherwise only one's own. */
  update(user: AuthenticatedUser | null, workOrder: WorkOrder) {
    if (hasPermission(user, Permission.WORK_ORDER_UPDATE_ANY)) {
      return true;
    }
    return (
      hasPermission(user, Permission.WORK_ORDER_UPDATE_OWN) && workOrder.createdById === user?.id
    );
  }
}
