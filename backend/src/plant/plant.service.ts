import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorizationService } from '@nestjs/authorization';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ERROR_MESSAGE } from '../common/constants/api.constant.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { PlantDto } from './dto/plant.dto.js';
import { Plant } from './entities/plant.entity.js';
import { PlantPolicy } from './plant.policy.js';

@Injectable()
export class PlantService {
  constructor(
    @InjectRepository(Plant) private readonly plantRepository: Repository<Plant>,
    private readonly authorizationService: AuthorizationService,
  ) {}

  /** The plants the user may see: all of them, or only the ones they are assigned to. */
  async list(user: AuthenticatedUser) {
    return (await this.listAccessible(user)).map((plant) => PlantDto.from(plant));
  }

  /** The plant records the user may see. For other services; routes return DTOs. */
  async listAccessible(user: AuthenticatedUser) {
    const canReadAll = await this.authorizationService.can(PlantPolicy, 'readAll', user);
    return this.plantRepository.find({
      where: canReadAll ? {} : { id: In(user.plantIds) },
      order: { name: 'ASC' },
    });
  }

  async findOne(user: AuthenticatedUser, plantId: string) {
    return PlantDto.from(await this.loadAccessible(user, plantId));
  }

  /**
   * The plant, if the user may see it. A plant they may not see is reported exactly like one
   * that does not exist, so the answer does not reveal which plants there are.
   */
  async loadAccessible(user: AuthenticatedUser, plantId: string) {
    const canRead = await this.authorizationService.can(PlantPolicy, 'readOne', user, plantId);
    const plant = canRead ? await this.plantRepository.findOneBy({ id: plantId }) : null;
    if (!plant) {
      throw new NotFoundException(ERROR_MESSAGE.NOT_FOUND);
    }
    return plant;
  }
}
