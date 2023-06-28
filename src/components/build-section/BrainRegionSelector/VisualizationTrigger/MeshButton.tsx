import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import ToggleButton from './ToggleButton';
import { useAtlasVisualizationManager } from '@/state/atlas';

interface MeshButtonProps {
  contentURL: string;
  regionID: string;
  /** Hexa color for the current region, as defined by Allen institute. */
  colorCode: string;
}

/**
 * This selectable button is used to show/hide meshes for regions.
 */
export default function MeshButton({ contentURL, regionID, colorCode }: MeshButtonProps) {
  const atlas = useAtlasVisualizationManager();
  const mesh = atlas.findVisibleMesh(contentURL);
  const selected = Boolean(mesh);
  const handleClick = () => {
    if (mesh) {
      atlas.removeVisibleMeshesOrPointClouds(mesh.contentURL, regionID);
    } else {
      atlas.addVisibleObjects(
        {
          type: 'mesh',
          contentURL,
          color: colorCode,
          isLoading: false,
          hasError: false,
        },
        {
          type: 'pointCloud',
          regionID,
          color: colorCode,
          isLoading: false,
          hasError: false,
        }
      );
    }
  };
  return (
    <ToggleButton busy={Boolean(mesh?.isLoading)} selected={selected} onClick={handleClick}>
      {selected ? <EyeOutlined /> : <EyeInvisibleOutlined />}
    </ToggleButton>
  );
}
