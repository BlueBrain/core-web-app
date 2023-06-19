/* eslint-disable @typescript-eslint/no-use-before-define */
import { useAtomValue } from 'jotai';
import Icon, { EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMemo, useCallback } from 'react';
import CellButton from './CellButton';
import { meshDistributionsAtom } from '@/state/brain-regions';
import { Mesh } from '@/types/ontologies';
import { useAtlasVisualizationManager } from '@/state/atlas';
import LoadingIcon from '@/components/icons/LoadingIcon';
import { AtlasVisualizationManager } from '@/state/atlas/atlas';

type BrainRegionVisualizationTriggerProps = {
  regionID: string;
  distribution: Mesh;
  colorCode: string;
};

function BrainRegionVisualizationTrigger({
  distribution,
  colorCode,
  regionID,
}: BrainRegionVisualizationTriggerProps) {
  const atlas = useAtlasVisualizationManager();
  const meshObject = atlas.findVisibleMesh(distribution.contentUrl);
  const pointCloudObject = atlas.findVisiblePointCloud(regionID);
  const isMeshOrCloudVisible = Boolean(meshObject) || Boolean(pointCloudObject);
  const isMeshOrCloudLoading = (meshObject?.isLoading || pointCloudObject?.isLoading) ?? false;

  const onClickEye = useClickEyeHandler(
    atlas,
    isMeshOrCloudVisible,
    isMeshOrCloudLoading,
    distribution,
    colorCode,
    regionID
  );

  // returns the icon to be rendered based on the current state of the button
  const meshIcon = useMemo(() => {
    if (isMeshOrCloudLoading) {
      return <Icon spin component={LoadingIcon} style={{ fontSize: '16px' }} />;
    }

    if (isMeshOrCloudVisible) {
      return <EyeOutlined style={{ color: 'white', fontSize: '16px' }} />;
    }

    return <EyeInvisibleOutlined style={{ color: '#91D5FF', fontSize: '16px' }} />;
  }, [isMeshOrCloudLoading, isMeshOrCloudVisible]);

  return (
    <>
      <CellButton regionID={regionID} colorCode={colorCode} />
      <button
        type="button"
        className="block border-none flex items-center justify-center w-[16px]"
        onClick={onClickEye}
      >
        {meshIcon}
      </button>
    </>
  );
}

export default function VisualizationTrigger({ colorCode, id }: { colorCode: string; id: string }) {
  const meshDistributions = useAtomValue(meshDistributionsAtom);

  if (meshDistributions === undefined) {
    return <LoadingOutlined style={{ fontSize: '16px' }} />;
  }

  const meshDistribution = meshDistributions && meshDistributions[id];

  if (meshDistribution && colorCode) {
    return (
      <BrainRegionVisualizationTrigger
        regionID={id}
        distribution={meshDistribution}
        colorCode={colorCode}
      />
    );
  }

  return (
    <button
      type="button"
      className="block border-none flex items-center justify-center w-[16px]"
      disabled
    >
      <EyeOutlined style={{ color: '#F5222D', fontSize: '16px' }} />
    </button>
  );
}

/**
 * Handles the eye clicking functionality.
 * If the brain region mesh is already visible, it hides it in the mesh collection and removes it from the state
 * If the brain region mesh is not visible, it fetches it and adds it in the state
 */
function useClickEyeHandler(
  atlas: AtlasVisualizationManager,
  isMeshOrCloudVisible: boolean,
  isMeshOrCloudLoading: boolean,
  distribution: Mesh,
  colorCode: string,
  regionID: string
) {
  return useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();

      // The eye is not clickable while loading in on.
      if (isMeshOrCloudLoading) return;

      // if the brain region mesh is already visible, remove it
      if (isMeshOrCloudVisible) {
        atlas.removeVisibleMeshesOrPointClouds(distribution.contentUrl, regionID);
      } else {
        atlas.addVisibleObjects(
          {
            type: 'mesh',
            contentURL: distribution.contentUrl,
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
    },
    [
      atlas,
      colorCode,
      distribution.contentUrl,
      isMeshOrCloudLoading,
      isMeshOrCloudVisible,
      regionID,
    ]
  );
}
