import type { AssetCriticality } from '../asset/enums/asset-criticality.enum.js';
import type { AssetStatus } from '../asset/enums/asset-status.enum.js';
import type { AssetType } from '../asset/enums/asset-type.enum.js';
import type {
  AssetConnection,
  AssetDocument,
  AssetIndicator,
  AssetInspection,
  AssetTrend,
  LabelledValue,
} from '../asset/types/asset-detail.type.js';
import type { Emirate } from '../plant/enums/emirate.enum.js';
import type { PlantModel } from '../plant/enums/plant-model.enum.js';
import type { PlantStatus } from '../plant/enums/plant-status.enum.js';
import type { PlantSector } from '../plant/enums/plant-sector.enum.js';
/** A position as the sample files spell it: x runs east, z runs south. */
interface SamplePosition {
  x: number;
  z: number;
}

interface SampleBuilding {
  position: SamplePosition;
  width: number;
  depth: number;
  height: number;
}
import type { WorkOrderStatus } from '../work-order/enums/work-order-status.enum.js';
import type { WorkOrderType } from '../work-order/enums/work-order-type.enum.js';

/** A plant as the sample file describes it. */
export interface SeedPlant {
  id: string;
  name: string;
  operator: string;
  sector: PlantSector;
  emirate: Emirate;
  longitude: number;
  latitude: number;
  description: string;
  model: PlantModel;
  status: PlantStatus;
}

interface SeedWorkOrder {
  id: string;
  title: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  /** Days from the day of seeding. */
  dayOffset: number;
}

export interface SeedAsset {
  id: string;
  tag: string;
  name: string;
  type: AssetType;
  area: string;
  status: AssetStatus;
  criticality: AssetCriticality;
  description: string;
  position: SamplePosition;
  rotation: number;
  scale: number;
  specifications: LabelledValue[];
  indicators: AssetIndicator[];
  trends: AssetTrend[];
  inspections: AssetInspection[];
  documents: AssetDocument[];
  connections: AssetConnection[];
  workOrders: SeedWorkOrder[];
}

export interface SeedLayout {
  scenery: SampleBuilding[];
  assets: SeedAsset[];
}
