import { useSearchParams } from 'react-router';
import { AssetConnectionsTab } from '@/components/dashboard/asset/AssetConnectionsTab';
import { AssetDocumentsTab } from '@/components/dashboard/asset/AssetDocumentsTab';
import { AssetInspectionsTab } from '@/components/dashboard/asset/AssetInspectionsTab';
import { AssetMaintenanceTab } from '@/components/dashboard/asset/AssetMaintenanceTab';
import { AssetOverviewTab } from '@/components/dashboard/asset/AssetOverviewTab';
import { AssetPerformanceTab } from '@/components/dashboard/asset/AssetPerformanceTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ASSET_COPY,
  ASSET_TAB_LABEL,
  ASSET_TAB_ORDER,
} from '@/constants/dashboard/asset/assetPageConstants';
import { TAB_SEARCH_PARAMETER } from '@/constants/routeConstants';
import { AssetTab } from '@/enums/dashboard/assetTab';
import type { Asset } from '@/types/dashboard/assetTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

interface AssetTabsProperties {
  plant: Plant;
  assets: Asset[];
  asset: Asset;
}

/** The asset's information, one subject per tab. The open tab is kept in the URL. */
export const AssetTabs = ({ plant, assets, asset }: AssetTabsProperties) => {
  const [searchParameters, setSearchParameters] = useSearchParams();

  const requestedTab = searchParameters.get(TAB_SEARCH_PARAMETER);
  const activeTab = ASSET_TAB_ORDER.find((tab) => tab === requestedTab) ?? AssetTab.OVERVIEW;
  const counts: Partial<Record<AssetTab, number>> = {
    [AssetTab.MAINTENANCE]: asset.workOrders.length,
    [AssetTab.INSPECTIONS]: asset.inspections.length,
    [AssetTab.DOCUMENTS]: asset.documents.length,
    [AssetTab.CONNECTIONS]: asset.connections.length,
  };

  const handleTabChange = (tab: string) => {
    setSearchParameters({ [TAB_SEARCH_PARAMETER]: tab });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-4">
      <div className="overflow-x-auto">
        <TabsList aria-label={ASSET_COPY.TABS_LABEL}>
          {ASSET_TAB_ORDER.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="px-3">
              {ASSET_TAB_LABEL[tab]}
              {counts[tab] !== undefined && (
                <span className="text-muted-foreground tabular-nums">{counts[tab]}</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value={AssetTab.OVERVIEW}>
        <AssetOverviewTab plant={plant} asset={asset} />
      </TabsContent>
      <TabsContent value={AssetTab.PERFORMANCE}>
        <AssetPerformanceTab trends={asset.trends} />
      </TabsContent>
      <TabsContent value={AssetTab.MAINTENANCE}>
        <AssetMaintenanceTab workOrders={asset.workOrders} />
      </TabsContent>
      <TabsContent value={AssetTab.INSPECTIONS}>
        <AssetInspectionsTab inspections={asset.inspections} />
      </TabsContent>
      <TabsContent value={AssetTab.DOCUMENTS}>
        <AssetDocumentsTab documents={asset.documents} />
      </TabsContent>
      <TabsContent value={AssetTab.CONNECTIONS}>
        <AssetConnectionsTab plant={plant} assets={assets} connections={asset.connections} />
      </TabsContent>
    </Tabs>
  );
};
