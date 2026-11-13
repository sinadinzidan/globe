import { geoGraticule10 } from 'd3-geo';
import type { GeoPath } from 'd3-geo';
import { memo } from 'react';
import { toPathData } from '@/lib/dashboard/flatMapGeometry';
import { cn } from '@/lib/utils';
import type { MapData } from '@/types/dashboard/mapTypes';

interface FlatMapLandProperties {
  mapData: MapData;
  pathGenerator: GeoPath;
  isRegionVisible: boolean;
}

const SPHERE = { type: 'Sphere' } as const;
const GRATICULE = geoGraticule10();
const OUTLINE_CLASS_NAME = 'fill-none [vector-effect:non-scaling-stroke]';

/** The static part of the map: ocean, graticule, land and borders. Redrawn only on resize. */
export const FlatMapLand = memo(
  ({ mapData, pathGenerator, isRegionVisible }: FlatMapLandProperties) => (
    <g>
      <path
        d={toPathData(pathGenerator, SPHERE)}
        className="fill-map-ocean stroke-map-border [vector-effect:non-scaling-stroke]"
      />
      <path
        d={toPathData(pathGenerator, GRATICULE)}
        className={cn(OUTLINE_CLASS_NAME, 'stroke-map-graticule')}
      />
      {mapData.countries.map((country) => (
        <path
          key={country.properties.name}
          d={toPathData(pathGenerator, country)}
          className="fill-map-land"
        />
      ))}
      <path
        d={toPathData(pathGenerator, mapData.borders)}
        className={cn(OUTLINE_CLASS_NAME, 'stroke-map-border')}
      />
      {mapData.detailCountries.map((country) => (
        <path
          key={country.properties.name}
          d={toPathData(pathGenerator, country)}
          className="fill-map-land stroke-map-border [vector-effect:non-scaling-stroke]"
        />
      ))}
      <path
        d={toPathData(pathGenerator, mapData.uae)}
        className={cn(
          'stroke-map-highlight-border stroke-2 transition-[fill] duration-700 [vector-effect:non-scaling-stroke]',
          isRegionVisible ? 'fill-map-highlight' : 'fill-map-land',
        )}
      />
      <g
        className={cn(
          'transition-opacity duration-700',
          isRegionVisible ? 'opacity-100' : 'opacity-0',
        )}
      >
        {mapData.emirates.map((emirate) => (
          <path
            key={emirate.id}
            d={toPathData(pathGenerator, emirate)}
            className={cn(
              OUTLINE_CLASS_NAME,
              'stroke-map-highlight-border/40 [stroke-dasharray:3_3]',
            )}
          />
        ))}
      </g>
    </g>
  ),
);
