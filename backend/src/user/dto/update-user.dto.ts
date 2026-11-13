import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum.js';
import { PLANT_ID_LENGTH } from '../../plant/entities/plant.entity.js';
import { FULL_NAME_MAXIMUM_LENGTH } from '../entities/user.entity.js';

/** Any subset of what an administrator may change about a user. */
export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Mariam Planner', maxLength: FULL_NAME_MAXIMUM_LENGTH })
  @IsString()
  @MinLength(1)
  @MaxLength(FULL_NAME_MAXIMUM_LENGTH)
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ enum: Role, enumName: 'Role' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ description: 'Deactivating a user signs them out everywhere.' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Replaces the plants the user is assigned to.',
    type: [String],
  })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(PLANT_ID_LENGTH, { each: true })
  @IsOptional()
  plantIds?: string[];
}
