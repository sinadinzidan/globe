import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Award,
  BookOpen,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CirclePause,
  CirclePlay,
  Container,
  Cylinder,
  Droplets,
  Eye,
  Factory,
  Fan,
  FileChartColumn,
  FileText,
  Flame,
  Heater,
  Loader,
  PencilRuler,
  Rows3,
  Ship,
  Snowflake,
  ThermometerSun,
  TowerControl,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AssetCriticality } from '@/enums/dashboard/assetCriticality';
import { AssetStatus } from '@/enums/dashboard/assetStatus';
import { AssetType } from '@/enums/dashboard/assetType';
import { ConnectionDirection } from '@/enums/dashboard/connectionDirection';
import { DocumentCategory } from '@/enums/dashboard/documentCategory';
import { InspectionResult } from '@/enums/dashboard/inspectionResult';
import { StatusTone } from '@/enums/dashboard/statusTone';
import { WorkOrderStatus } from '@/enums/dashboard/workOrderStatus';
import { WorkOrderType } from '@/enums/dashboard/workOrderType';

interface LabelledIcon {
  label: string;
  icon: LucideIcon;
}

export const ASSET_TYPE_PRESENTATION: Record<AssetType, LabelledIcon> = {
  [AssetType.STORAGE_TANK]: { label: 'Storage tank', icon: Cylinder },
  [AssetType.SPHERE_TANK]: { label: 'Pressurised sphere', icon: CircleDashed },
  [AssetType.PUMP]: { label: 'Pump', icon: Droplets },
  [AssetType.COMPRESSOR]: { label: 'Compressor', icon: Wind },
  [AssetType.HEAT_EXCHANGER]: { label: 'Heat exchanger', icon: ThermometerSun },
  [AssetType.FURNACE]: { label: 'Furnace', icon: Flame },
  [AssetType.COLUMN]: { label: 'Column', icon: TowerControl },
  [AssetType.STACK]: { label: 'Stack', icon: Factory },
  [AssetType.TURBINE]: { label: 'Turbine', icon: Fan },
  [AssetType.GENERATOR]: { label: 'Generator', icon: Zap },
  [AssetType.SLUG_CATCHER]: { label: 'Slug catcher', icon: Rows3 },
  [AssetType.SEPARATOR]: { label: 'Separator', icon: Container },
  [AssetType.SULPHUR_RECOVERY_UNIT]: { label: 'Sulphur recovery unit', icon: Heater },
  [AssetType.CRYOGENIC_EXCHANGER]: { label: 'Cryogenic exchanger', icon: Snowflake },
  [AssetType.LNG_TANK]: { label: 'LNG tank', icon: Cylinder },
  [AssetType.LOADING_JETTY]: { label: 'Loading jetty', icon: Ship },
};

interface StatusPresentation extends LabelledIcon {
  tone: StatusTone;
}

export const ASSET_STATUS_PRESENTATION: Record<AssetStatus, StatusPresentation> = {
  [AssetStatus.RUNNING]: { label: 'Running', icon: CirclePlay, tone: StatusTone.GOOD },
  [AssetStatus.STANDBY]: { label: 'Standby', icon: CirclePause, tone: StatusTone.NEUTRAL },
  [AssetStatus.UNDER_MAINTENANCE]: {
    label: 'Under maintenance',
    icon: Wrench,
    tone: StatusTone.WARNING,
  },
};

export const WORK_ORDER_STATUS_PRESENTATION: Record<WorkOrderStatus, StatusPresentation> = {
  [WorkOrderStatus.OPEN]: { label: 'Open', icon: CircleDashed, tone: StatusTone.WARNING },
  [WorkOrderStatus.PLANNED]: { label: 'Planned', icon: CirclePause, tone: StatusTone.NEUTRAL },
  [WorkOrderStatus.IN_PROGRESS]: { label: 'In progress', icon: Loader, tone: StatusTone.WARNING },
  [WorkOrderStatus.COMPLETED]: { label: 'Completed', icon: CircleCheck, tone: StatusTone.GOOD },
};

export const INSPECTION_RESULT_PRESENTATION: Record<InspectionResult, StatusPresentation> = {
  [InspectionResult.ACCEPTABLE]: {
    label: 'Acceptable',
    icon: CircleCheck,
    tone: StatusTone.GOOD,
  },
  [InspectionResult.MONITOR]: { label: 'Monitor', icon: Eye, tone: StatusTone.WARNING },
  [InspectionResult.ACTION_REQUIRED]: {
    label: 'Action required',
    icon: CircleAlert,
    tone: StatusTone.CRITICAL,
  },
};

/** Status colours are theme tokens and always appear with an icon and a label. */
export const STATUS_TONE_CLASS_NAME: Record<StatusTone, string> = {
  [StatusTone.GOOD]: 'border-status-good/40 text-status-good',
  [StatusTone.NEUTRAL]: 'border-border text-muted-foreground',
  [StatusTone.WARNING]: 'border-status-warning/40 text-status-warning',
  [StatusTone.CRITICAL]: 'border-status-critical/40 text-status-critical',
};

export const STATUS_TONE_DOT_CLASS_NAME: Record<StatusTone, string> = {
  [StatusTone.GOOD]: 'bg-status-good',
  [StatusTone.NEUTRAL]: 'bg-muted-foreground',
  [StatusTone.WARNING]: 'bg-status-warning',
  [StatusTone.CRITICAL]: 'bg-status-critical',
};

export const CRITICALITY_LABEL: Record<AssetCriticality, string> = {
  [AssetCriticality.HIGH]: 'High criticality',
  [AssetCriticality.MEDIUM]: 'Medium criticality',
  [AssetCriticality.LOW]: 'Low criticality',
};

export const WORK_ORDER_TYPE_LABEL: Record<WorkOrderType, string> = {
  [WorkOrderType.PREVENTIVE]: 'Preventive',
  [WorkOrderType.PREDICTIVE]: 'Predictive',
  [WorkOrderType.CORRECTIVE]: 'Corrective',
};

export const DOCUMENT_CATEGORY_PRESENTATION: Record<DocumentCategory, LabelledIcon> = {
  [DocumentCategory.DATASHEET]: { label: 'Datasheet', icon: FileText },
  [DocumentCategory.DRAWING]: { label: 'Drawing', icon: PencilRuler },
  [DocumentCategory.MANUAL]: { label: 'Manual', icon: BookOpen },
  [DocumentCategory.REPORT]: { label: 'Report', icon: FileChartColumn },
  [DocumentCategory.CERTIFICATE]: { label: 'Certificate', icon: Award },
};

export const CONNECTION_DIRECTION_PRESENTATION: Record<
  ConnectionDirection,
  LabelledIcon & { description: string }
> = {
  [ConnectionDirection.UPSTREAM]: {
    label: 'Upstream',
    description: 'What this asset receives from',
    icon: ArrowDownToLine,
  },
  [ConnectionDirection.DOWNSTREAM]: {
    label: 'Downstream',
    description: 'What this asset feeds',
    icon: ArrowUpFromLine,
  },
};

export const SAMPLE_DATA_LABEL = 'Sample data';
