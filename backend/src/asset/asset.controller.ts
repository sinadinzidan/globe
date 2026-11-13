import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiProtected } from '../common/decorators/api-errors.decorator.js';
import { Permission } from '../common/enums/permission.enum.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { AssetPolicy } from './asset.policy.js';
import { AssetService } from './asset.service.js';
import {
  AssetDetailDto,
  AssetDocumentDto,
  AssetInspectionDto,
  AssetTrendDto,
  PlantLayoutDto,
} from './dto/asset.dto.js';

const NOT_FOUND_DESCRIPTION =
  'There is no such plant or asset, or you have no access to the plant.';

@ApiTags('assets')
@Controller('plants/:plantId/assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  @Can(AssetPolicy, 'read')
  @ApiOperation({
    summary:
      'The 3D layout of a plant and its assets. Requires ASSET_READ and access to the plant.',
  })
  @ApiOkResponse({ type: PlantLayoutDto })
  @ApiNotFoundResponse({ description: NOT_FOUND_DESCRIPTION })
  @ApiProtected(Permission.ASSET_READ)
  getLayout(@CurrentUser() user: AuthenticatedUser, @Param('plantId') plantId: string) {
    return this.assetService.getLayout(user, plantId);
  }

  @Get(':assetId')
  @Can(AssetPolicy, 'read')
  @ApiOperation({
    summary: 'One asset with its specifications. Requires ASSET_READ and access to the plant.',
  })
  @ApiOkResponse({ type: AssetDetailDto })
  @ApiNotFoundResponse({ description: NOT_FOUND_DESCRIPTION })
  @ApiProtected(Permission.ASSET_READ)
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('plantId') plantId: string,
    @Param('assetId') assetId: string,
  ) {
    return this.assetService.findOne(user, plantId, assetId);
  }

  @Get(':assetId/trends')
  @Can(AssetPolicy, 'readPerformance')
  @ApiOperation({
    summary: "An asset's readings. Requires ASSET_PERFORMANCE_READ and access to the plant.",
  })
  @ApiOkResponse({ type: [AssetTrendDto] })
  @ApiNotFoundResponse({ description: NOT_FOUND_DESCRIPTION })
  @ApiProtected(Permission.ASSET_PERFORMANCE_READ)
  getTrends(
    @CurrentUser() user: AuthenticatedUser,
    @Param('plantId') plantId: string,
    @Param('assetId') assetId: string,
  ) {
    return this.assetService.getTrends(user, plantId, assetId);
  }

  @Get(':assetId/inspections')
  @Can(AssetPolicy, 'readInspections')
  @ApiOperation({
    summary: "An asset's inspections. Requires ASSET_INSPECTION_READ and access to the plant.",
  })
  @ApiOkResponse({ type: [AssetInspectionDto] })
  @ApiNotFoundResponse({ description: NOT_FOUND_DESCRIPTION })
  @ApiProtected(Permission.ASSET_INSPECTION_READ)
  getInspections(
    @CurrentUser() user: AuthenticatedUser,
    @Param('plantId') plantId: string,
    @Param('assetId') assetId: string,
  ) {
    return this.assetService.getInspections(user, plantId, assetId);
  }

  @Get(':assetId/documents')
  @Can(AssetPolicy, 'readDocuments')
  @ApiOperation({
    summary: "An asset's document register. Requires ASSET_DOCUMENT_READ and access to the plant.",
  })
  @ApiOkResponse({ type: [AssetDocumentDto] })
  @ApiNotFoundResponse({ description: NOT_FOUND_DESCRIPTION })
  @ApiProtected(Permission.ASSET_DOCUMENT_READ)
  getDocuments(
    @CurrentUser() user: AuthenticatedUser,
    @Param('plantId') plantId: string,
    @Param('assetId') assetId: string,
  ) {
    return this.assetService.getDocuments(user, plantId, assetId);
  }
}
