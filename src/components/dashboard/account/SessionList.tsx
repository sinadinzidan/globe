import { MonitorSmartphone } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { FormMessage } from '@/components/shared/form/FormMessage';
import { LoadingState } from '@/components/shared/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ACCOUNT_COPY } from '@/constants/dashboard/account/accountConstants';
import { useEndSession, useSessions } from '@/hooks/auth/useAccount';

const formatDate = (value: string) =>
  new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

/** The user's sessions, with the way to sign out the ones they do not recognise. */
export const SessionList = () => {
  const { data: sessions, isPending, isError, refetch } = useSessions();
  const endSession = useEndSession();

  const handleRetry = () => {
    void refetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3>{ACCOUNT_COPY.SESSIONS_TITLE}</h3>
        </CardTitle>
        <CardDescription>{ACCOUNT_COPY.SESSIONS_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isPending && <LoadingState />}
        {!isPending && isError && <ErrorState onRetry={handleRetry} />}
        {sessions?.length === 0 && (
          <EmptyState
            title={ACCOUNT_COPY.NO_SESSIONS_TITLE}
            description={ACCOUNT_COPY.NO_SESSIONS_DESCRIPTION}
          />
        )}
        {endSession.isError && <FormMessage message={ACCOUNT_COPY.END_SESSION_FAILED} />}
        {sessions && sessions.length > 0 && (
          <ul className="flex flex-col divide-y">
            {sessions.map((session) => (
              <li key={session.id} className="flex items-center gap-3 py-3">
                <MonitorSmartphone
                  aria-hidden="true"
                  className="size-5 shrink-0 text-muted-foreground"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm">
                    {session.userAgent ?? ACCOUNT_COPY.UNKNOWN_DEVICE}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ACCOUNT_COPY.SIGNED_IN_ON} {formatDate(session.createdAt)}
                    {session.ipAddress ? ` · ${session.ipAddress}` : ''}
                  </span>
                </div>
                {session.isCurrent ? (
                  <Badge variant="secondary">{ACCOUNT_COPY.THIS_SESSION}</Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={endSession.isPending}
                    onClick={() => {
                      endSession.mutate({ sessionId: session.id });
                    }}
                  >
                    {ACCOUNT_COPY.END_SESSION}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
