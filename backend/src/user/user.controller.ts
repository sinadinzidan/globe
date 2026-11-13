import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ApiProtected } from '../common/decorators/api-errors.decorator.js';
import { PageQueryDto } from '../common/dto/page-query.dto.js';
import { Permission } from '../common/enums/permission.enum.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserDto, UserPageDto } from './dto/user.dto.js';
import { UserPolicy } from './user.policy.js';
import { UserService } from './user.service.js';

const NOT_FOUND_DESCRIPTION = 'There is no such user.';
const INVALID_BODY_DESCRIPTION = 'The request is not valid.';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Can(UserPolicy, 'read')
  @ApiOperation({ summary: 'List users, a page at a time. Requires USER_READ.' })
  @ApiOkResponse({ type: UserPageDto })
  @ApiProtected(Permission.USER_READ)
  list(@Query() query: PageQueryDto) {
    return this.userService.list(query);
  }

  @Get(':userId')
  @Can(UserPolicy, 'read')
  @ApiOperation({ summary: 'One user. Requires USER_READ.' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: NOT_FOUND_DESCRIPTION })
  @ApiProtected(Permission.USER_READ)
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.findOne(userId);
  }

  @Post()
  @Can(UserPolicy, 'manage')
  @ApiOperation({ summary: 'Create a user. Requires USER_MANAGE.' })
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: INVALID_BODY_DESCRIPTION })
  @ApiConflictResponse({ description: 'A user with this email already exists.' })
  @ApiUnprocessableEntityResponse({ description: 'One of the plants does not exist.' })
  @ApiProtected(Permission.USER_MANAGE)
  create(@Body() input: CreateUserDto) {
    return this.userService.create(input);
  }

  @Patch(':userId')
  @Can(UserPolicy, 'manage')
  @ApiOperation({
    summary:
      'Change a user. Requires USER_MANAGE. You cannot change your own role or deactivate yourself. Changing a role or deactivating signs the user out everywhere.',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: INVALID_BODY_DESCRIPTION })
  @ApiNotFoundResponse({ description: NOT_FOUND_DESCRIPTION })
  @ApiUnprocessableEntityResponse({ description: 'One of the plants does not exist.' })
  @ApiProtected(Permission.USER_MANAGE)
  update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() changes: UpdateUserDto,
  ) {
    return this.userService.update(actor, userId, changes);
  }

  @Post(':userId/reset-password')
  @Can(UserPolicy, 'manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Set a user's password and sign them out everywhere. Requires USER_MANAGE.",
  })
  @ApiNoContentResponse({ description: 'The password was set.' })
  @ApiBadRequestResponse({ description: 'The password is not acceptable.' })
  @ApiNotFoundResponse({ description: NOT_FOUND_DESCRIPTION })
  @ApiProtected(Permission.USER_MANAGE)
  async resetPassword(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() input: ResetPasswordDto,
  ) {
    await this.userService.resetPassword(actor, userId, input.password);
  }
}
