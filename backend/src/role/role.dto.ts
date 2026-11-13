import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../common/enums/permission.enum.js';
import { Role } from '../common/enums/role.enum.js';

/** A role and what it allows. */
export class RoleDto {
  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role;

  @ApiProperty({ enum: Permission, enumName: 'Permission', isArray: true })
  permissions: Permission[];
}
