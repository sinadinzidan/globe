import type { ThreeEvent } from '@react-three/fiber';
import { MathUtils } from 'three';
import { AssetModel } from '@/components/dashboard/AssetModel';
import { usePlantColors } from '@/hooks/dashboard/plant/usePlantColors';
import type { Asset } from '@/types/dashboard/assetTypes';

interface PlantAssetNodeProperties {
  asset: Asset;
  isHighlighted: boolean;
  onFocus: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

/** One asset standing in the plant. Its whole model reacts to the pointer. */
export const PlantAssetNode = ({
  asset,
  isHighlighted,
  onFocus,
  onHover,
}: PlantAssetNodeProperties) => {
  const colors = usePlantColors();

  const handleClick = (clickEvent: ThreeEvent<MouseEvent>) => {
    clickEvent.stopPropagation();
    if (clickEvent.delta <= 1 + 1) {
      onFocus(asset.id);
    }
  };

  const handlePointerOver = (pointerEvent: ThreeEvent<PointerEvent>) => {
    pointerEvent.stopPropagation();
    onHover(asset.id);
  };

  const handlePointerOut = () => {
    onHover(null);
  };

  return (
    <group
      position={[asset.position.east, 0, asset.position.south]}
      rotation-y={MathUtils.degToRad(asset.rotation)}
      scale={asset.scale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <AssetModel type={asset.type} highlightColor={isHighlighted ? colors.highlight : undefined} />
    </group>
  );
};
