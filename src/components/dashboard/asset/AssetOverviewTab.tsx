import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import { ASSET_TYPE_PRESENTATION } from '@/constants/dashboard/assetConstants';
import type { Asset, LabelledValue } from '@/types/dashboard/assetTypes';
import type { Plant } from '@/types/dashboard/plantTypes';

interface AssetOverviewTabProperties {
  plant: Plant;
  asset: Asset;
}

interface FactListProperties {
  facts: LabelledValue[];
}

const FactList = ({ facts }: FactListProperties) => (
  <dl className="flex flex-col divide-y text-sm">
    {facts.map((fact) => (
      <div key={fact.label} className="flex justify-between gap-4 py-2">
        <dt className="text-muted-foreground">{fact.label}</dt>
        <dd className="text-right">{fact.value}</dd>
      </div>
    ))}
  </dl>
);

export const AssetOverviewTab = ({ plant, asset }: AssetOverviewTabProperties) => {
  const location = [
    { label: ASSET_COPY.TAG_LABEL, value: asset.tag },
    { label: ASSET_COPY.TYPE_LABEL, value: ASSET_TYPE_PRESENTATION[asset.type].label },
    { label: ASSET_COPY.PLANT_LABEL, value: plant.name },
    { label: ASSET_COPY.AREA_LABEL, value: asset.area },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <h3>{ASSET_COPY.ABOUT_TITLE}</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{asset.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <h3>{ASSET_COPY.LOCATION_TITLE}</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FactList facts={location} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <h3>{ASSET_COPY.SPECIFICATIONS_TITLE}</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FactList facts={asset.specifications} />
        </CardContent>
      </Card>
    </div>
  );
};
