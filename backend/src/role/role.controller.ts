import { Controller, Get } from '@nestjs/common';
import { Can } from '@nestjs/authorization';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiProtected } from '../common/decorators/api-errors.decorator.js';
import { Permission } from '../common/enums/permission.enum.js';
import { RoleDto } from './role.dto.js';
import { RolePolicy } from './role.policy.js';
import { RoleService } from './role.service.js';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Can(RolePolicy, 'read')
  @ApiOperation({ summary: 'Every role and the permissions it grants. Requires ROLE_READ.' })
  @ApiOkResponse({ type: [RoleDto] })
  @ApiProtected(Permission.ROLE_READ)
  list() {
    return this.roleService.list();
  }
}
