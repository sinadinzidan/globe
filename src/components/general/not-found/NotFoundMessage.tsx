import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { NOT_FOUND_COPY } from '@/constants/general/notFoundConstants';
import { DEFAULT_SIGNED_IN_PATH } from '@/constants/routeConstants';

export const NotFoundMessage = () => (
  <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">{NOT_FOUND_COPY.TITLE}</h1>
      <p className="text-sm text-muted-foreground">{NOT_FOUND_COPY.DESCRIPTION}</p>
    </div>
    <Button asChild>
      <Link to={DEFAULT_SIGNED_IN_PATH}>{NOT_FOUND_COPY.ACTION}</Link>
    </Button>
  </main>
);
