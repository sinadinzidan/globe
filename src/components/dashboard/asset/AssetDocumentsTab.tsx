import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import { DOCUMENT_CATEGORY_PRESENTATION } from '@/constants/dashboard/assetConstants';
import { useAssetDocuments } from '@/hooks/dashboard/asset/useAssetRecords';

interface AssetDocumentsTabProperties {
  plantId: string;
  assetId: string;
}

export const AssetDocumentsTab = ({ plantId, assetId }: AssetDocumentsTabProperties) => {
  const { data: documents, isPending, isError, refetch } = useAssetDocuments(plantId, assetId);

  const handleRetry = () => {
    void refetch();
  };

  if (isPending) {
    return <LoadingState />;
  }
  if (isError) {
    return <ErrorState onRetry={handleRetry} />;
  }
  if (documents.length === 0) {
    return (
      <EmptyState
        title={ASSET_COPY.NO_DOCUMENTS_TITLE}
        description={ASSET_COPY.NO_DOCUMENTS_DESCRIPTION}
      />
    );
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{ASSET_COPY.DOCUMENT_COLUMN}</TableHead>
              <TableHead>{ASSET_COPY.NUMBER_COLUMN}</TableHead>
              <TableHead>{ASSET_COPY.CATEGORY_COLUMN}</TableHead>
              <TableHead className="text-right">{ASSET_COPY.REVISION_COLUMN}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => {
              const { icon: Icon, label } = DOCUMENT_CATEGORY_PRESENTATION[document.category];
              return (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2">
                      <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
                      {document.title}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {document.number}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{label}</TableCell>
                  <TableCell className="text-right tabular-nums">{document.revision}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
