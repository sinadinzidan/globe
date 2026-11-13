import { SectorBadge } from '@/components/dashboard/SectorBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SAMPLE_DATA_LABEL } from '@/constants/dashboard/assetConstants';
import { PLANT_COPY } from '@/constants/dashboard/plant/plantSceneConstants';
import { EMIRATE_LABEL, SECTOR_PRESENTATION } from '@/constants/dashboard/plantConstants';
import type { Plant } from '@/types/dashboard/plantTypes';

interface PlantSummaryProperties {
  plant: Plant;
  assetCount: number;
}

/** Introduces the plant over the corner of the 3D view, and says what to do next. */
export const PlantSummary = ({ plant, assetCount }: PlantSummaryProperties) => (
  <Card
    size="sm"
    className="absolute top-4 right-16 left-4 animate-in bg-card/85 backdrop-blur-md fade-in slide-in-from-top-2 sm:right-auto sm:w-96"
  >
    <CardHeader>
      <CardTitle>
        <h2>{plant.name}</h2>
      </CardTitle>
      <CardDescription className="flex flex-wrap items-center gap-2">
        <SectorBadge sector={plant.sector} />
        {SECTOR_PRESENTATION[plant.sector].label} · {EMIRATE_LABEL[plant.emirate]}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-3">
      <p className="hidden text-sm text-muted-foreground sm:block">{plant.description}</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          {assetCount} {PLANT_COPY.ASSETS_UNIT}
        </Badge>
        <Badge variant="outline">{PLANT_COPY.MODEL_NOTE}</Badge>
        <Badge variant="outline">{SAMPLE_DATA_LABEL}</Badge>
      </div>
      <p className="text-sm">{PLANT_COPY.HINT}</p>
    </CardContent>
  </Card>
);
