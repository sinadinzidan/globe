import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  PASSWORD_MAXIMUM_LENGTH,
  PASSWORD_MINIMUM_LENGTH,
} from '../../common/constants/password.constant.js';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The new password. Give it to the user, who should change it after signing in.',
    format: 'password',
    minLength: PASSWORD_MINIMUM_LENGTH,
    maxLength: PASSWORD_MAXIMUM_LENGTH,
  })
  @IsString()
  @MinLength(PASSWORD_MINIMUM_LENGTH)
  @MaxLength(PASSWORD_MAXIMUM_LENGTH)
  password: string;
}
