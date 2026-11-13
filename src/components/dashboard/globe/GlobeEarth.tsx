import { geoGraticule10 } from 'd3-geo';
import { useMemo } from 'react';
import { AdditiveBlending, BackSide, DoubleSide } from 'three';
import {
  ATMOSPHERE_FRAGMENT_SHADER,
  ATMOSPHERE_VERTEX_SHADER,
  GLOBE,
} from '@/constants/dashboard/globe/globeConstants';
import { useGlobeColors } from '@/hooks/dashboard/globe/useGlobeColors';
import {
  buildFillGeometry,
  buildLineGeometry,
  buildStarGeometry,
  ringsOf,
} from '@/lib/dashboard/globeGeometry';
import type { MapData } from '@/types/dashboard/mapTypes';

interface GlobeEarthProperties {
  mapData: MapData;
  isRegionVisible: boolean;
}

/** The sphere and everything drawn on it: graticule, country outlines and the UAE highlight. */
export const GlobeEarth = ({ mapData, isRegionVisible }: GlobeEarthProperties) => {
  const colors = useGlobeColors();

  const stars = useMemo(() => buildStarGeometry(), []);
  const atmosphereUniforms = useMemo(
    () => ({ glowColor: { value: colors.atmosphere } }),
    [colors.atmosphere],
  );
  const graticule = useMemo(
    () => buildLineGeometry(geoGraticule10().coordinates, GLOBE.GRATICULE_RADIUS),
    [],
  );
  const outlines = useMemo(
    () =>
      buildLineGeometry(
        [...mapData.borders.coordinates, ...ringsOf(mapData.detailCountries)],
        GLOBE.OUTLINE_RADIUS,
      ),
    [mapData.borders, mapData.detailCountries],
  );
  const uaeFill = useMemo(() => buildFillGeometry(mapData.uae, GLOBE.FILL_RADIUS), [mapData.uae]);
  const uaeOutline = useMemo(
    () => buildLineGeometry(ringsOf([mapData.uae]), GLOBE.OUTLINE_RADIUS),
    [mapData.uae],
  );
  const emirateOutlines = useMemo(
    () => buildLineGeometry(ringsOf(mapData.emirates), GLOBE.OUTLINE_RADIUS),
    [mapData.emirates],
  );

  return (
    <>
      <points geometry={stars}>
        <pointsMaterial
          color={colors.star}
          size={GLOBE.STAR_SIZE}
          sizeAttenuation={false}
          transparent
          opacity={GLOBE.STAR_OPACITY}
        />
      </points>
      <mesh>
        <sphereGeometry
          args={[GLOBE.ATMOSPHERE_RADIUS, GLOBE.SPHERE_SEGMENTS, GLOBE.SPHERE_SEGMENTS]}
        />
        <shaderMaterial
          uniforms={atmosphereUniforms}
          vertexShader={ATMOSPHERE_VERTEX_SHADER}
          fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
          side={BackSide}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[GLOBE.RADIUS, GLOBE.SPHERE_SEGMENTS, GLOBE.SPHERE_SEGMENTS]} />
        <meshBasicMaterial color={colors.ocean} />
      </mesh>
      <lineSegments geometry={graticule}>
        <lineBasicMaterial color={colors.graticule} transparent opacity={GLOBE.GRATICULE_OPACITY} />
      </lineSegments>
      <lineSegments geometry={outlines}>
        <lineBasicMaterial color={colors.border} transparent opacity={GLOBE.OUTLINE_OPACITY} />
      </lineSegments>
      <mesh geometry={uaeFill}>
        <meshBasicMaterial color={colors.highlight} side={DoubleSide} />
      </mesh>
      <lineSegments geometry={emirateOutlines} visible={isRegionVisible}>
        <lineBasicMaterial
          color={colors.highlightBorder}
          transparent
          opacity={GLOBE.GRATICULE_OPACITY}
        />
      </lineSegments>
      <lineSegments geometry={uaeOutline}>
        <lineBasicMaterial color={colors.highlightBorder} />
      </lineSegments>
    </>
  );
};
