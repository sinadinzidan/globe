import { PLANT_SCENE } from '@/constants/dashboard/plant/plantSceneConstants';
import { ConnectionDirection } from '@/enums/dashboard/connectionDirection';
import { usePlantColors } from '@/hooks/dashboard/plant/usePlantColors';
import type { Asset } from '@/types/dashboard/assetTypes';

interface PlantPipesProperties {
  assets: Asset[];
}

/** Pipe and cable runs between connected assets, drawn as an L-shaped route along the ground. */
export const PlantPipes = ({ assets }: PlantPipesProperties) => {
  const colors = usePlantColors();

  const runs = assets.flatMap((asset) =>
    asset.connections
      .filter((connection) => connection.direction === ConnectionDirection.DOWNSTREAM)
      .flatMap((connection) => {
        const destination = assets.find((candidate) => candidate.id === connection.assetId);
        return destination
          ? [{ id: `${asset.id}:${destination.id}`, from: asset, to: destination }]
          : [];
      }),
  );

  return runs.map(({ id, from, to }) => {
    const lengthX = Math.abs(to.position.east - from.position.east) + PLANT_SCENE.PIPE_THICKNESS;
    const lengthZ = Math.abs(to.position.south - from.position.south) + PLANT_SCENE.PIPE_THICKNESS;
    return (
      <group key={id} position-y={PLANT_SCENE.PIPE_HEIGHT}>
        <mesh
          position={[
            (from.position.east + to.position.east) * PLANT_SCENE.HALF,
            0,
            from.position.south,
          ]}
        >
          <boxGeometry args={[lengthX, PLANT_SCENE.PIPE_THICKNESS, PLANT_SCENE.PIPE_THICKNESS]} />
          <meshStandardMaterial color={colors.pipe} roughness={1} />
        </mesh>
        <mesh
          position={[
            to.position.east,
            0,
            (from.position.south + to.position.south) * PLANT_SCENE.HALF,
          ]}
        >
          <boxGeometry args={[PLANT_SCENE.PIPE_THICKNESS, PLANT_SCENE.PIPE_THICKNESS, lengthZ]} />
          <meshStandardMaterial color={colors.pipe} roughness={1} />
        </mesh>
      </group>
    );
  });
};
