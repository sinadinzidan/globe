import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { SectorBadge } from '@/components/dashboard/SectorBadge';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { ASSET_STATUS_PRESENTATION } from '@/constants/dashboard/assetConstants';
import { buildAssetPath } from '@/lib/routePaths';
import type { AttentionItem } from '@/types/dashboard/operationTypes';

interface AttentionListItemProperties {
  item: AttentionItem;
}

/** An asset that is not running, linking straight to its page. */
export const AttentionListItem = ({ item }: AttentionListItemProperties) => {
  const status = ASSET_STATUS_PRESENTATION[item.status];

  return (
    <li>
      <Link
        to={buildAssetPath(item.plantId, item.assetId)}
        className="flex items-center gap-3 rounded-lg px-2 py-2 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <SectorBadge sector={item.sector} />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-sm font-medium">
            {item.tag} · {item.name}
          </span>
          <span className="truncate text-xs text-muted-foreground">{item.plantName}</span>
          <span>
            <StatusBadge label={status.label} icon={status.icon} tone={status.tone} />
          </span>
        </span>
        <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
};
