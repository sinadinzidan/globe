import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiProtected } from '../common/decorators/api-errors.decorator.js';
import { Permission } from '../common/enums/permission.enum.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { PlantPolicy } from '../plant/plant.policy.js';
import { OperationSummaryDto } from './dto/operation-summary.dto.js';
import { OperationService } from './operation.service.js';

@ApiTags('operations')
@Controller('operations')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Get('summary')
  @Can(PlantPolicy, 'read')
  @ApiOperation({
    summary:
      'The state of operations by stream, across the sites you can reach. Requires PLANT_READ. Work order counts need WORK_ORDER_READ.',
  })
  @ApiOkResponse({ type: OperationSummaryDto })
  @ApiProtected(Permission.PLANT_READ)
  getSummary(@CurrentUser() user: AuthenticatedUser) {
    return this.operationService.getSummary(user);
  }
}
