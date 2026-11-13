import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import {
  ASSET_STATUS_PRESENTATION,
  ASSET_TYPE_PRESENTATION,
  CRITICALITY_LABEL,
  SAMPLE_DATA_LABEL,
} from '@/constants/dashboard/assetConstants';
import { FOCUSED_ASSET_SEARCH_PARAMETER } from '@/constants/dashboard/plant/plantSceneConstants';
import { buildPlantPath } from '@/lib/routePaths';
import type { Asset } from '@/types/dashboard/assetTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

interface AssetHeaderProperties {
  plant: Plant;
  asset: Asset;
}

export const AssetHeader = ({ plant, asset }: AssetHeaderProperties) => {
  const { icon: TypeIcon, label: typeLabel } = ASSET_TYPE_PRESENTATION[asset.type];
  const plantPath = `${buildPlantPath(plant.id)}?${FOCUSED_ASSET_SEARCH_PARAMETER}=${asset.id}`;

  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <TypeIcon aria-hidden="true" className="size-6" />
        </span>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">
              {asset.tag} · {typeLabel} · {asset.area}
            </p>
            <h2 className="text-2xl font-semibold">{asset.name}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge {...ASSET_STATUS_PRESENTATION[asset.status]} />
            <Badge variant="outline">{CRITICALITY_LABEL[asset.criticality]}</Badge>
            <Badge variant="outline">{SAMPLE_DATA_LABEL}</Badge>
          </div>
        </div>
      </div>
      <Button asChild variant="outline">
        <Link to={plantPath}>
          <ArrowLeft aria-hidden="true" />
          {ASSET_COPY.BACK_TO_PLANT}
        </Link>
      </Button>
    </header>
  );
};
