import { Globe, Map as MapIcon } from 'lucide-react';
import { NavLink } from 'react-router';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { ROUTE_PATH } from '@/constants/routeConstants';
import { RoutePath } from '@/enums/routePath';
import { cn } from '@/lib/utils';

const VIEWS = [
  { path: ROUTE_PATH[RoutePath.FLAT_MAP], label: DASHBOARD_COPY.FLAT_MAP_VIEW, icon: MapIcon },
  { path: ROUTE_PATH[RoutePath.GLOBE], label: DASHBOARD_COPY.GLOBE_VIEW, icon: Globe },
];

export const ViewSwitcher = () => (
  <nav
    aria-label={DASHBOARD_COPY.VIEW_SWITCHER_LABEL}
    className="flex items-center gap-1 rounded-lg bg-muted p-1"
  >
    {VIEWS.map(({ path, label, icon: Icon }) => (
      <NavLink
        key={path}
        to={path}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
            isActive && 'bg-background text-foreground shadow-sm',
          )
        }
      >
        <Icon aria-hidden="true" className="size-4" />
        {label}
      </NavLink>
    ))}
  </nav>
);
