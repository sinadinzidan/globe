import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../common/enums/permission.enum.js';
import { Role } from '../../common/enums/role.enum.js';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type.js';
import { hasPermission } from '../../common/utilities/permission.utility.js';

/** Who is signed in and what they may do. The web app builds its interface from this. */
export class CurrentUserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'administrator@example.com' })
  email: string;

  @ApiProperty({ example: 'Amal Administrator' })
  fullName: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role;

  @ApiProperty({ enum: Permission, enumName: 'Permission', isArray: true })
  permissions: Permission[];

  @ApiProperty({
    description: 'Whether the user reaches every plant, rather than only assigned ones.',
  })
  hasAllPlantAccess: boolean;

  @ApiProperty({
    description: 'The plants the user is assigned to.',
    type: [String],
    example: ['ruwais-refinery'],
  })
  plantIds: string[];

  @ApiProperty({ description: 'The session this request was made with.', format: 'uuid' })
  sessionId: string;

  static from(user: AuthenticatedUser): CurrentUserDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      permissions: [...user.permissions],
      hasAllPlantAccess: hasPermission(user, Permission.PLANT_READ_ALL),
      plantIds: user.plantIds,
      sessionId: user.sessionId,
    };
  }
}
