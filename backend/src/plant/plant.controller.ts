import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiProtected } from '../common/decorators/api-errors.decorator.js';
import { Permission } from '../common/enums/permission.enum.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { PlantDto } from './dto/plant.dto.js';
import { PlantPolicy } from './plant.policy.js';
import { PlantService } from './plant.service.js';

@ApiTags('plants')
@Controller('plants')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Get()
  @Can(PlantPolicy, 'read')
  @ApiOperation({
    summary:
      'The plants you may see. Requires PLANT_READ. Without PLANT_READ_ALL, only your assigned plants.',
  })
  @ApiOkResponse({ type: [PlantDto] })
  @ApiProtected(Permission.PLANT_READ)
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.plantService.list(user);
  }

  @Get(':plantId')
  @Can(PlantPolicy, 'read')
  @ApiOperation({ summary: 'One plant. Requires PLANT_READ and access to the plant.' })
  @ApiOkResponse({ type: PlantDto })
  @ApiNotFoundResponse({ description: 'There is no such plant, or you have no access to it.' })
  @ApiProtected(Permission.PLANT_READ)
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('plantId') plantId: string) {
    return this.plantService.findOne(user, plantId);
  }
}
