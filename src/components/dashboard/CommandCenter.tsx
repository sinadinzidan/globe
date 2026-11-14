import { AttentionListItem } from '@/components/dashboard/AttentionListItem';
import { StreamCard } from '@/components/dashboard/StreamCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { COMMAND_CENTER_COPY } from '@/constants/dashboard/commandCenterConstants';
import { useOperationSummary } from '@/hooks/dashboard/useOperationSummary';

/** The operations tab: every stream of the value chain at a glance, and what needs attention. */
export const CommandCenter = () => {
  const { data: summary, isPending, isError, refetch } = useOperationSummary();

  const handleRetry = () => {
    void refetch();
  };

  if (isPending) {
    return <LoadingState message={COMMAND_CENTER_COPY.LOADING} />;
  }
  if (isError) {
    return <ErrorState onRetry={handleRetry} />;
  }
  return (
    <section aria-label={COMMAND_CENTER_COPY.TAB} className="flex flex-col lg:min-h-0 lg:flex-1">
      <ScrollArea className="lg:min-h-0 lg:flex-1">
        <div className="flex flex-col gap-6 p-4">
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium">{COMMAND_CENTER_COPY.STREAMS_TITLE}</h2>
            <p className="text-xs text-muted-foreground">{COMMAND_CENTER_COPY.STREAMS_HINT}</p>
            <ul className="flex flex-col gap-2">
              {summary.streams.map((stream) => (
                <StreamCard
                  key={stream.sector}
                  stream={stream}
                  hasWorkOrderCounts={summary.hasWorkOrderCounts}
                />
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium">{COMMAND_CENTER_COPY.ATTENTION_TITLE}</h2>
            <p className="text-xs text-muted-foreground">
              {COMMAND_CENTER_COPY.ATTENTION_DESCRIPTION}
            </p>
            {summary.attention.length === 0 ? (
              <EmptyState
                title={COMMAND_CENTER_COPY.ATTENTION_EMPTY_TITLE}
                description={COMMAND_CENTER_COPY.ATTENTION_EMPTY_DESCRIPTION}
              />
            ) : (
              <ul className="flex flex-col">
                {summary.attention.map((item) => (
                  <AttentionListItem key={`${item.plantId}/${item.assetId}`} item={item} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </ScrollArea>
    </section>
  );
};
