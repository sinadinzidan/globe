import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from '../plant/entities/plant.entity.js';
import { User } from './entities/user.entity.js';
import { UserController } from './user.controller.js';
import { UserPolicy } from './user.policy.js';
import { UserService } from './user.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Plant])],
  controllers: [UserController],
  providers: [UserService, UserPolicy],
  exports: [UserService],
})
export class UserModule {}
