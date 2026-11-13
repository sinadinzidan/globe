import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  PASSWORD_MAXIMUM_LENGTH,
  PASSWORD_MINIMUM_LENGTH,
} from '../../common/constants/password.constant.js';

export class ChangePasswordDto {
  @ApiProperty({ description: 'The password in use now.', format: 'password' })
  @IsString()
  @MinLength(1)
  @MaxLength(PASSWORD_MAXIMUM_LENGTH)
  currentPassword: string;

  @ApiProperty({
    description: 'The new password. Any characters are allowed; very common passwords are refused.',
    format: 'password',
    minLength: PASSWORD_MINIMUM_LENGTH,
    maxLength: PASSWORD_MAXIMUM_LENGTH,
  })
  @IsString()
  @MinLength(PASSWORD_MINIMUM_LENGTH)
  @MaxLength(PASSWORD_MAXIMUM_LENGTH)
  newPassword: string;
}
