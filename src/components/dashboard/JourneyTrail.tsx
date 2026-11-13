import { Fragment } from 'react';
import { Link } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { FOCUSED_ASSET_SEARCH_PARAMETER } from '@/constants/dashboard/plant/plantSceneConstants';
import { ROUTE_PATH } from '@/constants/routeConstants';
import { RoutePath } from '@/enums/routePath';
import { usePlantJourney } from '@/hooks/dashboard/usePlantJourney';
import { buildPlantPath } from '@/lib/routePaths';

/** Shows how far into the journey the page is, and leads back up: map, plant, asset. */
export const JourneyTrail = () => {
  const { plant, asset } = usePlantJourney();

  const steps = [
    { label: DASHBOARD_COPY.JOURNEY_MAP, path: ROUTE_PATH[RoutePath.FLAT_MAP] },
    ...(plant ? [{ label: plant.name, path: buildPlantPath(plant.id) }] : []),
    ...(plant && asset
      ? [
          {
            label: `${asset.tag} · ${asset.name}`,
            path: `${buildPlantPath(plant.id)}?${FOCUSED_ASSET_SEARCH_PARAMETER}=${asset.id}`,
          },
        ]
      : []),
  ];

  return (
    <Breadcrumb aria-label={DASHBOARD_COPY.JOURNEY_LABEL}>
      <BreadcrumbList>
        {steps.map((step, index) => (
          <Fragment key={step.path}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === steps.length - 1 ? (
                <BreadcrumbPage>{step.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={step.path}>{step.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
