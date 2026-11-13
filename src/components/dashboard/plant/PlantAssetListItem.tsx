import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { StatusDot } from '@/components/dashboard/StatusDot';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ASSET_STATUS_PRESENTATION,
  ASSET_TYPE_PRESENTATION,
} from '@/constants/dashboard/assetConstants';
import { PLANT_COPY } from '@/constants/dashboard/plant/plantSceneConstants';
import { buildAssetPath } from '@/lib/routePaths';
import { cn } from '@/lib/utils';
import type { Asset } from '@/types/dashboard/assetTypes';

interface PlantAssetListItemProperties {
  plantId: string;
  asset: Asset;
  isFocused: boolean;
  onFocus: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export const PlantAssetListItem = ({
  plantId,
  asset,
  isFocused,
  onFocus,
  onHover,
}: PlantAssetListItemProperties) => {
  const { icon: Icon } = ASSET_TYPE_PRESENTATION[asset.type];
  const status = ASSET_STATUS_PRESENTATION[asset.status];
  const openLabel = `${PLANT_COPY.OPEN_ASSET} ${asset.tag}`;

  const handleFocus = () => {
    onFocus(asset.id);
  };

  const handlePointerEnter = () => {
    onHover(asset.id);
  };

  const handlePointerLeave = () => {
    onHover(null);
  };

  return (
    <li
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={cn(
        'flex items-center gap-1 rounded-lg transition-colors hover:bg-muted',
        isFocused && 'bg-muted ring-1 ring-primary/50',
      )}
    >
      <button
        type="button"
        aria-pressed={isFocused}
        onClick={handleFocus}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-2 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">
            {asset.tag} · {asset.name}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <StatusDot tone={status.tone} />
            {status.label}
          </span>
        </span>
      </button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon-sm" className="mr-1">
            <Link to={buildAssetPath(plantId, asset.id)} aria-label={openLabel}>
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">{openLabel}</TooltipContent>
      </Tooltip>
    </li>
  );
};
