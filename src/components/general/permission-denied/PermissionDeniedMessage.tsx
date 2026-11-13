import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { AUTH_COPY } from '@/constants/authConstants';
import { DEFAULT_SIGNED_IN_PATH } from '@/constants/routeConstants';

export const PermissionDeniedMessage = () => (
  <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
    <ShieldAlert aria-hidden="true" className="size-8 text-status-warning" />
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-semibold">{AUTH_COPY.PERMISSION_DENIED_TITLE}</h2>
      <p className="text-sm text-muted-foreground">{AUTH_COPY.PERMISSION_DENIED_DESCRIPTION}</p>
    </div>
    <Button asChild variant="outline">
      <Link to={DEFAULT_SIGNED_IN_PATH}>{AUTH_COPY.BACK_TO_MAP}</Link>
    </Button>
  </main>
);
