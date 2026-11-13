import type { ConnectionDirection } from '../enums/connection-direction.enum.js';
import type { DocumentCategory } from '../enums/document-category.enum.js';
import type { InspectionResult } from '../enums/inspection-result.enum.js';

export interface LabelledValue {
  label: string;
  value: string;
}

export interface AssetIndicator extends LabelledValue {
  unit: string;
}

/** Hourly readings, oldest first. */
export interface AssetTrend {
  id: string;
  label: string;
  unit: string;
  values: number[];
}

export interface AssetInspection {
  id: string;
  title: string;
  result: InspectionResult;
  daysAgo: number;
  nextDueInDays: number;
  finding: string;
}

export interface AssetDocument {
  id: string;
  title: string;
  number: string;
  category: DocumentCategory;
  revision: string;
}

export interface AssetConnection {
  /** The `code` of the connected asset in the same plant. */
  assetId: string;
  direction: ConnectionDirection;
  medium: string;
}
