import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TokenService } from '@nestjs/authentication';
import { AuthorizationService } from '@nestjs/authorization';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ROLE_PERMISSIONS } from '../common/constants/role-permission.constant.js';
import type { PageQueryDto } from '../common/dto/page-query.dto.js';
import { PasswordService } from '../common/services/password.service.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { Plant } from '../plant/entities/plant.entity.js';
import { USER_MESSAGE } from './constants/user.constant.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import { UserDto, type UserPageDto } from './dto/user.dto.js';
import { User } from './entities/user.entity.js';
import { UserPolicy } from './user.policy.js';
import { normalizeEmail } from './utilities/normalize-email.utility.js';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Plant) private readonly plantRepository: Repository<Plant>,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  /** The user with their password hash and lockout state. For checking a password only. */
  findForLogin(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: normalizeEmail(email) })
      .getOne();
  }

  /** The signed-in user as guards and policies see it, or `null` if they may no longer sign in. */
  async findAuthenticated(userId: string, sessionId: string): Promise<AuthenticatedUser | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      relations: { plants: true },
      select: { id: true, email: true, fullName: true, role: true, plants: { id: true } },
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      permissions: ROLE_PERMISSIONS[user.role],
      plantIds: user.plants.map((plant) => plant.id),
      sessionId,
    };
  }

  async clearFailedLogins(userId: string) {
    await this.userRepository.update({ id: userId }, { failedLoginCount: 0, lockedUntil: null });
  }

  async recordFailedLogin(userId: string, failedLoginCount: number, lockedUntil: Date | null) {
    await this.userRepository.update({ id: userId }, { failedLoginCount, lockedUntil });
  }

  /** Sets a new password and ends every session of the user, on every device. */
  async setPassword(userId: string, password: string) {
    this.passwordService.assertAcceptable(password);
    const passwordHash = await this.passwordService.hash(password);
    await this.userRepository.update(
      { id: userId },
      { passwordHash, failedLoginCount: 0, lockedUntil: null },
    );
    await this.tokenService.revokeAll(userId);
  }

  async list(query: PageQueryDto): Promise<UserPageDto> {
    const [users, total] = await this.userRepository.findAndCount({
      relations: { plants: true },
      order: { fullName: 'ASC' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    });
    return {
      items: users.map((user) => UserDto.from(user)),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async findOne(userId: string) {
    return UserDto.from(await this.loadUser(userId));
  }

  async create(input: CreateUserDto) {
    const email = normalizeEmail(input.email);
    if (await this.userRepository.existsBy({ email })) {
      throw new ConflictException(USER_MESSAGE.EMAIL_TAKEN);
    }
    this.passwordService.assertAcceptable(input.password);
    const user = await this.userRepository.save(
      this.userRepository.create({
        email,
        fullName: input.fullName.trim(),
        role: input.role,
        passwordHash: await this.passwordService.hash(input.password),
        plants: await this.loadPlants(input.plantIds ?? []),
      }),
    );
    this.logger.log(`User ${user.id} was created with the role ${user.role}.`);
    return UserDto.from(user);
  }

  /** Applies an administrator's changes. Changing access signs the user out everywhere. */
  async update(actor: AuthenticatedUser, userId: string, changes: UpdateUserDto) {
    await this.authorizationService.authorize(UserPolicy, 'update', actor, userId, changes);
    const user = await this.loadUser(userId);
    const willLoseAccess =
      changes.isActive === false || (changes.role !== undefined && changes.role !== user.role);
    Object.assign(user, {
      ...(changes.fullName !== undefined && { fullName: changes.fullName.trim() }),
      ...(changes.role !== undefined && { role: changes.role }),
      ...(changes.isActive !== undefined && { isActive: changes.isActive }),
      ...(changes.plantIds !== undefined && { plants: await this.loadPlants(changes.plantIds) }),
    });
    const saved = await this.userRepository.save(user);
    if (willLoseAccess) {
      await this.tokenService.revokeAll(userId);
    }
    this.logger.log(`User ${userId} was updated by ${actor.id}.`);
    return UserDto.from(saved);
  }

  async resetPassword(actor: AuthenticatedUser, userId: string, password: string) {
    await this.loadUser(userId);
    await this.setPassword(userId, password);
    this.logger.log(`The password of user ${userId} was reset by ${actor.id}.`);
  }

  private async loadUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { plants: true },
    });
    if (!user) {
      throw new NotFoundException(USER_MESSAGE.NOT_FOUND);
    }
    return user;
  }

  private async loadPlants(plantIds: string[]) {
    const plants =
      plantIds.length > 0 ? await this.plantRepository.findBy({ id: In(plantIds) }) : [];
    if (plants.length !== plantIds.length) {
      throw new UnprocessableEntityException(USER_MESSAGE.UNKNOWN_PLANT);
    }
    return plants;
  }
}
