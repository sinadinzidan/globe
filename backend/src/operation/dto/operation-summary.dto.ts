import { ApiProperty } from '@nestjs/swagger';
import { AssetStatus } from '../../asset/enums/asset-status.enum.js';
import { PlantSector } from '../../plant/enums/plant-sector.enum.js';

/** How one stream of the value chain is doing, across the sites the user can reach. */
export class StreamSummaryDto {
  @ApiProperty({ enum: PlantSector, enumName: 'PlantSector' })
  sector: PlantSector;

  @ApiProperty({ description: 'Sites in this stream.' })
  plantCount: number;

  @ApiProperty({ description: 'Sites that are operating, as opposed to being built or planned.' })
  operatingPlantCount: number;

  @ApiProperty()
  assetCount: number;

  @ApiProperty()
  runningAssetCount: number;

  @ApiProperty()
  standbyAssetCount: number;

  @ApiProperty()
  maintenanceAssetCount: number;

  @ApiProperty({
    description: 'Work orders not yet completed. Zero without the permission to see work orders.',
  })
  openWorkOrderCount: number;
}

/** An asset that is out of service, for the command center's attention list. */
export class AttentionItemDto {
  @ApiProperty({ example: 'habshan-gas-complex' })
  plantId: string;

  @ApiProperty({ example: 'Habshan Gas Processing Complex' })
  plantName: string;

  @ApiProperty({ enum: PlantSector, enumName: 'PlantSector' })
  sector: PlantSector;

  @ApiProperty({ example: 'sru-601' })
  assetId: string;

  @ApiProperty({ example: 'SRU-601' })
  tag: string;

  @ApiProperty({ example: 'Sulphur recovery unit' })
  name: string;

  @ApiProperty({ enum: AssetStatus, enumName: 'AssetStatus' })
  status: AssetStatus;
}

export class OperationSummaryDto {
  @ApiProperty({ type: [StreamSummaryDto], description: 'One entry per stream, upstream first.' })
  streams: StreamSummaryDto[];

  @ApiProperty({
    type: [AttentionItemDto],
    description: 'Assets under maintenance, most critical first.',
  })
  attention: AttentionItemDto[];

  @ApiProperty({ description: 'Whether work order counts are included for this user.' })
  hasWorkOrderCounts: boolean;
}
