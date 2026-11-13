import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiProtected } from '../common/decorators/api-errors.decorator.js';
import { Permission } from '../common/enums/permission.enum.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { CreateWorkOrderDto } from './dto/create-work-order.dto.js';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto.js';
import { WorkOrderDto } from './dto/work-order.dto.js';
import { WorkOrderPolicy } from './work-order.policy.js';
import { WorkOrderService } from './work-order.service.js';

const ASSET_NOT_FOUND_DESCRIPTION =
  'There is no such plant or asset, or you have no access to the plant.';
const INVALID_BODY_DESCRIPTION = 'The request is not valid.';

@ApiTags('work-orders')
@Controller()
export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  @Get('plants/:plantId/assets/:assetId/work-orders')
  @Can(WorkOrderPolicy, 'read')
  @ApiOperation({
    summary: "An asset's work orders. Requires WORK_ORDER_READ and access to the plant.",
  })
  @ApiOkResponse({ type: [WorkOrderDto] })
  @ApiNotFoundResponse({ description: ASSET_NOT_FOUND_DESCRIPTION })
  @ApiProtected(Permission.WORK_ORDER_READ)
  listForAsset(
    @CurrentUser() user: AuthenticatedUser,
    @Param('plantId') plantId: string,
    @Param('assetId') assetId: string,
  ) {
    return this.workOrderService.listForAsset(user, plantId, assetId);
  }

  @Post('plants/:plantId/assets/:assetId/work-orders')
  @Can(WorkOrderPolicy, 'create')
  @ApiOperation({
    summary: 'Raise a work order on an asset. Requires WORK_ORDER_CREATE and access to the plant.',
  })
  @ApiCreatedResponse({ type: WorkOrderDto })
  @ApiBadRequestResponse({ description: INVALID_BODY_DESCRIPTION })
  @ApiNotFoundResponse({ description: ASSET_NOT_FOUND_DESCRIPTION })
  @ApiProtected(Permission.WORK_ORDER_CREATE)
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('plantId') plantId: string,
    @Param('assetId') assetId: string,
    @Body() input: CreateWorkOrderDto,
  ) {
    return this.workOrderService.create(user, plantId, assetId, input);
  }

  @Patch('work-orders/:workOrderId')
  @Can(WorkOrderPolicy, 'updateSome')
  @ApiOperation({
    summary:
      'Change a work order. Requires access to its plant, and either WORK_ORDER_UPDATE_ANY, or WORK_ORDER_UPDATE_OWN for one you raised.',
  })
  @ApiOkResponse({ type: WorkOrderDto })
  @ApiBadRequestResponse({ description: INVALID_BODY_DESCRIPTION })
  @ApiNotFoundResponse({
    description: 'There is no such work order, or you have no access to its plant.',
  })
  @ApiProtected(Permission.WORK_ORDER_UPDATE_ANY, Permission.WORK_ORDER_UPDATE_OWN)
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('workOrderId', ParseUUIDPipe) workOrderId: string,
    @Body() changes: UpdateWorkOrderDto,
  ) {
    return this.workOrderService.update(user, workOrderId, changes);
  }
}
