import { PLANT_SCENE } from '@/constants/dashboard/plant/plantSceneConstants';
import { usePlantColors } from '@/hooks/dashboard/plant/usePlantColors';
import type { SceneryBuilding } from '@/types/dashboard/assetTypes';

interface PlantGroundProperties {
  scenery: SceneryBuilding[];
}

const FLAT_ROTATION = -Math.PI * PLANT_SCENE.HALF;

/** The ground, the plant's paved pad with its grid, and the buildings that are not assets. */
export const PlantGround = ({ scenery }: PlantGroundProperties) => {
  const colors = usePlantColors();

  return (
    <>
      <mesh rotation-x={FLAT_ROTATION}>
        <planeGeometry args={[PLANT_SCENE.GROUND_SIZE, PLANT_SCENE.GROUND_SIZE]} />
        <meshStandardMaterial color={colors.ground} roughness={1} />
      </mesh>
      <mesh position-y={PLANT_SCENE.PAD_HEIGHT * PLANT_SCENE.HALF}>
        <boxGeometry args={[PLANT_SCENE.PAD_SIZE, PLANT_SCENE.PAD_HEIGHT, PLANT_SCENE.PAD_SIZE]} />
        <meshStandardMaterial color={colors.pad} roughness={1} />
      </mesh>
      <gridHelper
        args={[PLANT_SCENE.PAD_SIZE, PLANT_SCENE.GRID_DIVISIONS, colors.grid, colors.grid]}
        position-y={PLANT_SCENE.GRID_HEIGHT}
      />
      {scenery.map((building) => (
        <mesh
          key={`${String(building.position.x)}:${String(building.position.z)}`}
          position={[building.position.x, building.height * PLANT_SCENE.HALF, building.position.z]}
        >
          <boxGeometry args={[building.width, building.height, building.depth]} />
          <meshStandardMaterial color={colors.scenery} roughness={1} />
        </mesh>
      ))}
    </>
  );
};
