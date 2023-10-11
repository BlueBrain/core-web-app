import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import ToggleButton from './ToggleButton';
import { useAtlasVisualizationManager } from '@/state/atlas';
import { visibleExploreBrainRegionsAtom } from '@/state/explore-section/interactive';

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
  const [visibleExploreBrainRegions, setVisibleExploreBrainRegions] = useAtom(
    visibleExploreBrainRegionsAtom
  );

  const handleClick = () => {
    // if already exists, remove it. If not, add it
    if (visibleExploreBrainRegions.includes(regionID)) {
      setVisibleExploreBrainRegions([
        ...visibleExploreBrainRegions.filter((id) => id !== regionID),
      ]);
    } else {
      setVisibleExploreBrainRegions([...visibleExploreBrainRegions, regionID]);
    }
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
