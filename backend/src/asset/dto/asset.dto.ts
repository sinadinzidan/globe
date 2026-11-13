import { ApiProperty } from '@nestjs/swagger';
import type { Asset } from '../entities/asset.entity.js';
import { AssetCriticality } from '../enums/asset-criticality.enum.js';
import { AssetStatus } from '../enums/asset-status.enum.js';
import { AssetType } from '../enums/asset-type.enum.js';
import { ConnectionDirection } from '../enums/connection-direction.enum.js';
import { DocumentCategory } from '../enums/document-category.enum.js';
import { InspectionResult } from '../enums/inspection-result.enum.js';

export class GroundPositionDto {
  @ApiProperty({ description: 'Metres east of the plant centre.' })
  east: number;

  @ApiProperty({ description: 'Metres south of the plant centre.' })
  south: number;
}

export class SceneryBuildingDto {
  @ApiProperty({ type: GroundPositionDto })
  position: GroundPositionDto;

  @ApiProperty()
  width: number;

  @ApiProperty()
  depth: number;

  @ApiProperty()
  height: number;
}

export class LabelledValueDto {
  @ApiProperty({ example: 'Design pressure' })
  label: string;

  @ApiProperty({ example: '3.5 bar' })
  value: string;
}

export class AssetIndicatorDto extends LabelledValueDto {
  @ApiProperty({ example: '%' })
  unit: string;
}

export class AssetConnectionDto {
  @ApiProperty({
    description: 'The identifier of the connected asset in the same plant.',
    example: 'h-101',
  })
  assetId: string;

  @ApiProperty({ enum: ConnectionDirection, enumName: 'ConnectionDirection' })
  direction: ConnectionDirection;

  @ApiProperty({ example: 'Hot feed' })
  medium: string;
}

/** An asset as the plant view needs it: what it is and where it stands. */
export class AssetSummaryDto {
  @ApiProperty({
    description: 'Identifies the asset inside its plant, and in URLs.',
    example: 'c-101',
  })
  id: string;

  @ApiProperty({ example: 'C-101' })
  tag: string;

  @ApiProperty({ example: 'Fractionation column' })
  name: string;

  @ApiProperty({ enum: AssetType, enumName: 'AssetType' })
  type: AssetType;

  @ApiProperty({ example: 'Process unit' })
  area: string;

  @ApiProperty({ enum: AssetStatus, enumName: 'AssetStatus' })
  status: AssetStatus;

  @ApiProperty({ enum: AssetCriticality, enumName: 'AssetCriticality' })
  criticality: AssetCriticality;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: GroundPositionDto })
  position: GroundPositionDto;

  @ApiProperty({ description: 'Rotation about the vertical axis, in degrees.' })
  rotation: number;

  @ApiProperty()
  scale: number;

  @ApiProperty({ type: [AssetIndicatorDto] })
  indicators: AssetIndicatorDto[];

  @ApiProperty({ type: [AssetConnectionDto] })
  connections: AssetConnectionDto[];

  static from(asset: Asset): AssetSummaryDto {
    return {
      id: asset.code,
      tag: asset.tag,
      name: asset.name,
      type: asset.type,
      area: asset.area,
      status: asset.status,
      criticality: asset.criticality,
      description: asset.description,
      position: { east: asset.positionEast, south: asset.positionSouth },
      rotation: asset.rotation,
      scale: asset.scale,
      indicators: asset.indicators,
      connections: asset.connections,
    };
  }
}

export class AssetDetailDto extends AssetSummaryDto {
  @ApiProperty({ type: [LabelledValueDto] })
  specifications: LabelledValueDto[];

  static override from(asset: Asset): AssetDetailDto {
    return Object.assign(new AssetDetailDto(), AssetSummaryDto.from(asset), {
      specifications: asset.specifications,
    });
  }
}

/** Everything the 3D plant view draws. */
export class PlantLayoutDto {
  @ApiProperty({ type: [SceneryBuildingDto] })
  scenery: SceneryBuildingDto[];

  @ApiProperty({ type: [AssetSummaryDto] })
  assets: AssetSummaryDto[];
}

export class AssetTrendDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Top temperature' })
  label: string;

  @ApiProperty({ example: '°C' })
  unit: string;

  @ApiProperty({ description: 'Hourly readings, oldest first.', type: [Number] })
  values: number[];
}

export class AssetInspectionDto {
  @ApiProperty({ example: 'INS-20412' })
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: InspectionResult, enumName: 'InspectionResult' })
  result: InspectionResult;

  @ApiProperty()
  daysAgo: number;

  @ApiProperty({ description: 'Negative when the next inspection is overdue.' })
  nextDueInDays: number;

  @ApiProperty()
  finding: string;
}

export class AssetDocumentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ example: 'C-101-DAT-412' })
  number: string;

  @ApiProperty({ enum: DocumentCategory, enumName: 'DocumentCategory' })
  category: DocumentCategory;

  @ApiProperty({ example: 'C' })
  revision: string;
}
