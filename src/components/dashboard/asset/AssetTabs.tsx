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
  ASSET_TAB_PERMISSION,
} from '@/constants/dashboard/asset/assetPageConstants';
import { TAB_SEARCH_PARAMETER } from '@/constants/routeConstants';
import { AssetTab } from '@/enums/dashboard/assetTab';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
import { findEnumValue } from '@/lib/enumValue';
import type { Asset } from '@/types/dashboard/assetTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

interface AssetTabsProperties {
  plant: Plant;
  assets: Asset[];
  asset: Asset;
}

/**
 * The asset's information, one subject per tab. A tab is only offered, and its data only
 * requested, when the user's role includes it. The open tab is kept in the URL.
 */
export const AssetTabs = ({ plant, assets, asset }: AssetTabsProperties) => {
  const [searchParameters, setSearchParameters] = useSearchParams();
  const { hasPermission } = useCurrentUser();

  const availableTabs = ASSET_TAB_ORDER.filter((tab) => {
    const permission = ASSET_TAB_PERMISSION[tab];
    return permission === undefined || hasPermission(permission);
  });
  const requestedTab = searchParameters.get(TAB_SEARCH_PARAMETER);
  const activeTab = findEnumValue(availableTabs, requestedTab) ?? AssetTab.OVERVIEW;

  const handleTabChange = (tab: string) => {
    setSearchParameters({ [TAB_SEARCH_PARAMETER]: tab });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-4">
      <div className="overflow-x-auto">
        <TabsList aria-label={ASSET_COPY.TABS_LABEL}>
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="px-3">
              {ASSET_TAB_LABEL[tab]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value={AssetTab.OVERVIEW}>
        <AssetOverviewTab plant={plant} asset={asset} />
      </TabsContent>
      {availableTabs.includes(AssetTab.PERFORMANCE) && (
        <TabsContent value={AssetTab.PERFORMANCE}>
          <AssetPerformanceTab plantId={plant.id} assetId={asset.id} />
        </TabsContent>
      )}
      {availableTabs.includes(AssetTab.MAINTENANCE) && (
        <TabsContent value={AssetTab.MAINTENANCE}>
          <AssetMaintenanceTab plantId={plant.id} assetId={asset.id} />
        </TabsContent>
      )}
      {availableTabs.includes(AssetTab.INSPECTIONS) && (
        <TabsContent value={AssetTab.INSPECTIONS}>
          <AssetInspectionsTab plantId={plant.id} assetId={asset.id} />
        </TabsContent>
      )}
      {availableTabs.includes(AssetTab.DOCUMENTS) && (
        <TabsContent value={AssetTab.DOCUMENTS}>
          <AssetDocumentsTab plantId={plant.id} assetId={asset.id} />
        </TabsContent>
      )}
      <TabsContent value={AssetTab.CONNECTIONS}>
        <AssetConnectionsTab plant={plant} assets={assets} connections={asset.connections} />
      </TabsContent>
    </Tabs>
  );
};
