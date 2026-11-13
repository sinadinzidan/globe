import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { EMAIL_MAXIMUM_LENGTH } from '../../user/entities/user.entity.js';
import { PASSWORD_MAXIMUM_LENGTH } from '../../common/constants/password.constant.js';

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the account.',
    example: 'administrator@example.com',
  })
  @IsEmail()
  @MaxLength(EMAIL_MAXIMUM_LENGTH)
  email: string;

  @ApiProperty({ description: 'The password of the account.', format: 'password' })
  @IsString()
  @MinLength(1)
  @MaxLength(PASSWORD_MAXIMUM_LENGTH)
  password: string;
}
