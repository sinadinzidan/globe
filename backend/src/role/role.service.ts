import { Injectable } from '@nestjs/common';
import { ROLE_PERMISSIONS } from '../common/constants/role-permission.constant.js';
import { Role } from '../common/enums/role.enum.js';
import type { RoleDto } from './role.dto.js';

@Injectable()
export class RoleService {
  /** Every role with its permissions, as the access matrix defines them. */
  list(): RoleDto[] {
    return Object.values(Role).map((role) => ({ role, permissions: [...ROLE_PERMISSIONS[role]] }));
  }
}
