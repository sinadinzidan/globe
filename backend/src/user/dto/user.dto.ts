import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum.js';
import type { User } from '../entities/user.entity.js';

/** A user as the API returns it. The password hash and lockout counters are never included. */
export class UserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'planner@example.com' })
  email: string;

  @ApiProperty({ example: 'Mariam Planner' })
  fullName: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role;

  @ApiProperty({ description: 'Deactivated users cannot sign in.' })
  isActive: boolean;

  @ApiProperty({
    description: 'The plants the user is assigned to.',
    type: [String],
    example: ['ruwais-refinery'],
  })
  plantIds: string[];

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  static from(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      plantIds: user.plants.map((plant) => plant.id),
      createdAt: user.createdAt,
    };
  }
}

export class UserPageDto {
  @ApiProperty({ type: [UserDto] })
  items: UserDto[];

  @ApiProperty({ description: 'The number of users in total.' })
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;
}
