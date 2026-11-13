import type { AssetCriticality } from '@/enums/dashboard/assetCriticality';
import type { AssetStatus } from '@/enums/dashboard/assetStatus';
import type { AssetType } from '@/enums/dashboard/assetType';
import type { ConnectionDirection } from '@/enums/dashboard/connectionDirection';
import type { DocumentCategory } from '@/enums/dashboard/documentCategory';
import type { InspectionResult } from '@/enums/dashboard/inspectionResult';
import type { PlantModel } from '@/enums/dashboard/plantModel';
import type { WorkOrderStatus } from '@/enums/dashboard/workOrderStatus';
import type { WorkOrderType } from '@/enums/dashboard/workOrderType';

/** A position on the plant's ground plane, in metres from its centre. */
export interface GroundPosition {
  x: number;
  z: number;
}

export interface LabelledValue {
  label: string;
  value: string;
}

export interface AssetIndicator extends LabelledValue {
  unit: string;
}

/** Hourly readings, oldest first. The last value is the most recent hour. */
export interface AssetTrend {
  id: string;
  label: string;
  unit: string;
  values: number[];
}

export interface WorkOrder {
  id: string;
  title: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  /** Days from today: negative when completed in the past, positive when due in the future. */
  dayOffset: number;
}

export interface Inspection {
  id: string;
  title: string;
  result: InspectionResult;
  daysAgo: number;
  /** Negative when the next inspection is overdue. */
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
  assetId: string;
  direction: ConnectionDirection;
  medium: string;
}

export interface Asset {
  id: string;
  tag: string;
  name: string;
  type: AssetType;
  area: string;
  status: AssetStatus;
  criticality: AssetCriticality;
  description: string;
  position: GroundPosition;
  /** Rotation about the vertical axis, in degrees. */
  rotation: number;
  scale: number;
  specifications: LabelledValue[];
  indicators: AssetIndicator[];
  trends: AssetTrend[];
  workOrders: WorkOrder[];
  inspections: Inspection[];
  documents: AssetDocument[];
  connections: AssetConnection[];
}

/** A building that fills out the plant but is not an asset. */
export interface SceneryBuilding {
  position: GroundPosition;
  width: number;
  depth: number;
  height: number;
}

export interface PlantLayout {
  model: PlantModel;
  scenery: SceneryBuilding[];
  assets: Asset[];
}
