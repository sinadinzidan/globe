import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { StatusDot } from '@/components/dashboard/StatusDot';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import {
  ASSET_STATUS_PRESENTATION,
  ASSET_TYPE_PRESENTATION,
  CONNECTION_DIRECTION_PRESENTATION,
} from '@/constants/dashboard/assetConstants';
import { ConnectionDirection } from '@/enums/dashboard/connectionDirection';
import { buildAssetPath } from '@/lib/routePaths';
import type { Asset, AssetConnection } from '@/types/dashboard/assetTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

interface AssetConnectionsTabProperties {
  plant: Plant;
  assets: Asset[];
  connections: AssetConnection[];
}

const DIRECTION_ORDER = [ConnectionDirection.UPSTREAM, ConnectionDirection.DOWNSTREAM];

/** The assets this one receives from and feeds. Each one leads on to its own page. */
export const AssetConnectionsTab = ({
  plant,
  assets,
  connections,
}: AssetConnectionsTabProperties) => {
  const groups = DIRECTION_ORDER.map((direction) => ({
    direction,
    links: connections
      .filter((connection) => connection.direction === direction)
      .flatMap((connection) => {
        const linkedAsset = assets.find((candidate) => candidate.id === connection.assetId);
        return linkedAsset ? [{ connection, linkedAsset }] : [];
      }),
  }));

  if (groups.every((group) => group.links.length === 0)) {
    return (
      <EmptyState
        title={ASSET_COPY.NO_CONNECTIONS_TITLE}
        description={ASSET_COPY.NO_CONNECTIONS_DESCRIPTION}
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {groups.map(({ direction, links }) => {
        const {
          icon: DirectionIcon,
          label,
          description,
        } = CONNECTION_DIRECTION_PRESENTATION[direction];
        return (
          <Card key={direction}>
            <CardHeader>
              <CardTitle>
                <h3 className="flex items-center gap-2">
                  <DirectionIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                  {label}
                </h3>
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <p className="text-sm text-muted-foreground">{ASSET_COPY.NONE_IN_DIRECTION}</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {links.map(({ connection, linkedAsset }) => {
                    const { icon: TypeIcon } = ASSET_TYPE_PRESENTATION[linkedAsset.type];
                    const status = ASSET_STATUS_PRESENTATION[linkedAsset.status];
                    return (
                      <li key={linkedAsset.id}>
                        <Link
                          to={buildAssetPath(plant.id, linkedAsset.id)}
                          className="group flex items-center gap-3 rounded-lg border p-3 transition-colors outline-none hover:border-primary/60 hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <TypeIcon aria-hidden="true" className="size-4" />
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-sm font-medium">
                              {linkedAsset.tag} · {linkedAsset.name}
                            </span>
                            <span className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                              <StatusDot tone={status.tone} />
                              {status.label} · {ASSET_COPY.CARRIES}{' '}
                              {connection.medium.toLowerCase()}
                            </span>
                          </span>
                          <ArrowRight
                            aria-hidden="true"
                            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
