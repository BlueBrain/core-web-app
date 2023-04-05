import Icon, { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import LoadingIcon from '@/components/icons/LoadingIcon';
import { useAtlasVisualizationManager } from '@/state/atlas';
import { Mesh } from '@/types/ontologies';

type BrainRegionVisualizationTriggerProps = {
  regionID: string;
  distribution: Mesh;
  colorCode: string;
};

export default function BrainRegionVisualizationTrigger({
  distribution,
  colorCode,
  regionID,
}: BrainRegionVisualizationTriggerProps) {
  const atlas = useAtlasVisualizationManager();
  const meshObject = atlas.findVisibleMesh(distribution.contentUrl);
  const pointCloudObject = atlas.findVisiblePointCloud(regionID);
  const isVisible = Boolean(meshObject) || Boolean(pointCloudObject);
  const isLoading = meshObject?.isLoading || pointCloudObject?.isLoading;

  /**
   * Handles the eye clicking functionality.
   * If the brain region mesh is already visible, it hides it in the mesh collection and removes it from the state
   * If the brain region mesh is not visible, it fetches it and adds it in the state
   */
  const onClickEye = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    // The eye is not clickable while loading in on.
    if (isLoading) return;

    // if the brain region mesh is already visible, remove it
    if (isVisible) {
      atlas.removeVisibleObjects(distribution.contentUrl, regionID);
    } else {
      atlas.addVisibleObjects(
        {
          contentURL: distribution.contentUrl,
          color: colorCode,
          isLoading: false,
          hasError: false,
        },
        {
          regionID,
          color: colorCode,
          isLoading: false,
          hasError: false,
        }
      );
    }
  };

  // returns the icon to be rendered based on the current state of the button
  const icon = useMemo(() => {
    if (isLoading) {
      return <Icon spin component={LoadingIcon} style={{ fontSize: '16px' }} />;
    }

    if (isVisible) {
      return <EyeOutlined style={{ color: 'white', fontSize: '16px' }} />;
    }

    return <EyeInvisibleOutlined style={{ color: '#91D5FF', fontSize: '16px' }} />;
  }, [isLoading, isVisible]);

  return (
    <button
      type="button"
      className="block border-none flex items-center justify-center w-[16px]"
      onClick={onClickEye}
    >
      {icon}
    </button>
  );
}
