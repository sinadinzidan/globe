import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiProtected } from '../common/decorators/api-errors.decorator.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { ExplorerProgressDto, LeaderboardEntryDto } from './dto/explorer.dto.js';
import { ExplorerService } from './explorer.service.js';

const NOT_FOUND_DESCRIPTION =
  'There is no such plant or asset, or you have no access to the plant.';

/** Each user's own exploring progress. Every route acts on the signed-in user only. */
@ApiTags('explorer')
@Can.Anyone()
@Controller('explorer')
export class ExplorerController {
  constructor(private readonly explorerService: ExplorerService) {}

  @Get('progress')
  @ApiOperation({
    summary: 'Your discoveries, rank and achievements. Any signed-in user.',
  })
  @ApiOkResponse({ type: ExplorerProgressDto })
  @ApiProtected()
  getProgress(@CurrentUser() user: AuthenticatedUser) {
    return this.explorerService.getProgress(user);
  }

  @Post('plants/:plantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record that you opened a plant. Needs access to the plant.' })
  @ApiOkResponse({ type: ExplorerProgressDto })
  @ApiNotFoundResponse({ description: NOT_FOUND_DESCRIPTION })
  @ApiProtected()
  discoverPlant(@CurrentUser() user: AuthenticatedUser, @Param('plantId') plantId: string) {
    return this.explorerService.discoverPlant(user, plantId);
  }

  @Post('plants/:plantId/assets/:assetId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record that you opened an asset. Needs access to its plant.' })
  @ApiOkResponse({ type: ExplorerProgressDto })
  @ApiNotFoundResponse({ description: NOT_FOUND_DESCRIPTION })
  @ApiProtected()
  inspectAsset(
    @CurrentUser() user: AuthenticatedUser,
    @Param('plantId') plantId: string,
    @Param('assetId') assetId: string,
  ) {
    return this.explorerService.inspectAsset(user, plantId, assetId);
  }

  @Post('globe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record that you opened the 3D globe. Any signed-in user.' })
  @ApiOkResponse({ type: ExplorerProgressDto })
  @ApiProtected()
  markGlobeOpened(@CurrentUser() user: AuthenticatedUser) {
    return this.explorerService.markGlobeOpened(user);
  }

  @Delete('progress')
  @ApiOperation({ summary: 'Clear your own progress. Any signed-in user.' })
  @ApiOkResponse({ type: ExplorerProgressDto })
  @ApiProtected()
  reset(@CurrentUser() user: AuthenticatedUser) {
    return this.explorerService.reset(user);
  }

  @Get('leaderboard')
  @ApiOperation({
    summary:
      'The explorers with the most achievements: names and standing only. Any signed-in user.',
  })
  @ApiOkResponse({ type: [LeaderboardEntryDto] })
  @ApiProtected()
  getLeaderboard(@CurrentUser() user: AuthenticatedUser) {
    return this.explorerService.getLeaderboard(user);
  }
}
