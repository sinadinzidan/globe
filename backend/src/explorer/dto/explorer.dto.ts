import { ApiProperty } from '@nestjs/swagger';
import { AchievementId } from '../enums/achievement-id.enum.js';
import { ExplorerRank } from '../enums/explorer-rank.enum.js';

export class AchievementStatusDto {
  @ApiProperty({ enum: AchievementId, enumName: 'AchievementId' })
  id: AchievementId;

  @ApiProperty({ description: 'How far along the achievement is.' })
  current: number;

  @ApiProperty({ description: 'What it takes to unlock it.' })
  total: number;

  @ApiProperty()
  isUnlocked: boolean;
}

/** Everything the signed-in user has explored and earned. */
export class ExplorerProgressDto {
  @ApiProperty({ type: [String], example: ['habshan-gas-complex'] })
  discoveredPlantIds: string[];

  @ApiProperty({ description: 'Inspected assets, each as `plantId/assetId`.', type: [String] })
  inspectedAssetKeys: string[];

  @ApiProperty()
  hasOpenedGlobe: boolean;

  @ApiProperty({ description: 'Plants discovered, among those the user can reach.' })
  discoveredCount: number;

  @ApiProperty({ description: 'Plants the user can reach.' })
  totalCount: number;

  @ApiProperty({ description: 'Assets inspected, among those the user can reach.' })
  inspectedCount: number;

  @ApiProperty({ description: 'Assets the user can reach.' })
  assetCount: number;

  @ApiProperty({ type: [AchievementStatusDto] })
  achievements: AchievementStatusDto[];

  @ApiProperty()
  unlockedCount: number;

  @ApiProperty()
  experience: number;

  @ApiProperty({ enum: ExplorerRank, enumName: 'ExplorerRank' })
  rank: ExplorerRank;

  @ApiProperty({ description: 'One-based position of the rank.' })
  level: number;

  @ApiProperty({ enum: ExplorerRank, enumName: 'ExplorerRank', nullable: true })
  nextRank: ExplorerRank | null;

  @ApiProperty()
  experienceToNextRank: number;

  @ApiProperty({ description: 'Progress through the current rank, from 0 to 100.' })
  rankProgressPercent: number;
}

export class LeaderboardEntryDto {
  @ApiProperty({ description: 'Position on the board, starting at 1.' })
  position: number;

  @ApiProperty({ example: 'Reem Reliability' })
  fullName: string;

  @ApiProperty()
  experience: number;

  @ApiProperty({ enum: ExplorerRank, enumName: 'ExplorerRank' })
  rank: ExplorerRank;

  @ApiProperty()
  level: number;

  @ApiProperty({ description: 'Whether this entry is the signed-in user.' })
  isCurrentUser: boolean;
}
