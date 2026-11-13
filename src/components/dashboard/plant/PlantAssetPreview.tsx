import { ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ASSET_STATUS_PRESENTATION,
  ASSET_TYPE_PRESENTATION,
} from '@/constants/dashboard/assetConstants';
import { PLANT_COPY } from '@/constants/dashboard/plant/plantSceneConstants';
import { buildAssetPath } from '@/lib/routePaths';
import type { Asset } from '@/types/dashboard/assetTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

interface PlantAssetPreviewProperties {
  plant: Plant;
  asset: Asset;
  onClose: () => void;
}

/** A first look at the focused asset, with the way on to its own page. */
export const PlantAssetPreview = ({ plant, asset, onClose }: PlantAssetPreviewProperties) => (
  <Card
    key={asset.id}
    size="sm"
    className="absolute top-4 right-16 left-4 animate-in bg-card/85 backdrop-blur-md fade-in slide-in-from-top-2 sm:right-auto sm:w-96"
  >
    <CardHeader>
      <CardTitle>
        <h2>
          {asset.tag} · {asset.name}
        </h2>
      </CardTitle>
      <CardDescription>
        {ASSET_TYPE_PRESENTATION[asset.type].label} · {asset.area}
      </CardDescription>
      <CardAction>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={PLANT_COPY.CLOSE_PREVIEW}
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent className="flex flex-col gap-3">
      <div>
        <StatusBadge {...ASSET_STATUS_PRESENTATION[asset.status]} />
      </div>
      <p className="text-sm text-muted-foreground">{asset.description}</p>
      <dl className="grid grid-cols-2 gap-2">
        {asset.indicators.slice(0, 1 + 1).map((indicator) => (
          <div
            key={indicator.label}
            className="flex flex-col-reverse rounded-lg bg-muted/50 px-3 py-2"
          >
            <dt className="text-xs text-muted-foreground">{indicator.label}</dt>
            <dd className="text-base font-semibold tabular-nums">
              {indicator.value} {indicator.unit}
            </dd>
          </div>
        ))}
      </dl>
    </CardContent>
    <CardFooter>
      <Button asChild className="w-full">
        <Link to={buildAssetPath(plant.id, asset.id)}>
          {PLANT_COPY.OPEN_ASSET}
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </CardFooter>
  </Card>
);
