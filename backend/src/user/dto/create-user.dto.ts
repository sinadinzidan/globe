import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  PASSWORD_MAXIMUM_LENGTH,
  PASSWORD_MINIMUM_LENGTH,
} from '../../common/constants/password.constant.js';
import { Role } from '../../common/enums/role.enum.js';
import { PLANT_ID_LENGTH } from '../../plant/entities/plant.entity.js';
import { EMAIL_MAXIMUM_LENGTH, FULL_NAME_MAXIMUM_LENGTH } from '../entities/user.entity.js';

export class CreateUserDto {
  @ApiProperty({ example: 'planner@example.com', maxLength: EMAIL_MAXIMUM_LENGTH })
  @IsEmail()
  @MaxLength(EMAIL_MAXIMUM_LENGTH)
  email: string;

  @ApiProperty({ example: 'Mariam Planner', maxLength: FULL_NAME_MAXIMUM_LENGTH })
  @IsString()
  @MinLength(1)
  @MaxLength(FULL_NAME_MAXIMUM_LENGTH)
  fullName: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description: 'The first password. Give it to the user, who should change it after signing in.',
    format: 'password',
    minLength: PASSWORD_MINIMUM_LENGTH,
    maxLength: PASSWORD_MAXIMUM_LENGTH,
  })
  @IsString()
  @MinLength(PASSWORD_MINIMUM_LENGTH)
  @MaxLength(PASSWORD_MAXIMUM_LENGTH)
  password: string;

  @ApiPropertyOptional({
    description: 'The plants to assign. Not needed for roles that reach every plant.',
    type: [String],
    example: ['ruwais-refinery'],
  })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(PLANT_ID_LENGTH, { each: true })
  @IsOptional()
  plantIds?: string[];
}
