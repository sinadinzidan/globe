import { Module } from '@nestjs/common';
import { RoleController } from './role.controller.js';
import { RolePolicy } from './role.policy.js';
import { RoleService } from './role.service.js';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RolePolicy],
})
export class RoleModule {}
