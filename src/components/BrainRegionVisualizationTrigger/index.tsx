import Icon, { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { useMemo } from 'react';
import AtlasVisualizationAtom from '@/state/brain-factory/atlas';
import LoadingIcon from '@/components/icons/LoadingIcon';
import { MeshDistribution } from '@/types/atlas';

type BrainRegionVisualizationTriggerProps = {
  regionID: string;
  distribution: MeshDistribution;
  colorCode: string;
};

export default function BrainRegionVisualizationTrigger({
  distribution,
  colorCode,
  regionID,
}: BrainRegionVisualizationTriggerProps) {
  const atlasVisualizationAtom = useAtomValue(AtlasVisualizationAtom);
  const isVisible =
    atlasVisualizationAtom.visibleMeshes.filter(
      (mesh) => mesh.contentURL === distribution.contentUrl
    ).length > 0;
  const setAtlasVisualizationAtom = useSetAtom(AtlasVisualizationAtom);
  const meshObject = atlasVisualizationAtom.visibleMeshes.find(
    (meshToFind) => meshToFind.contentURL === distribution.contentUrl
  );
  const pointCloudObject = atlasVisualizationAtom.visiblePointClouds.find(
    (pointCloud) => pointCloud.regionID === regionID
  );
  let isLoading = false;
  if (meshObject && pointCloudObject && (meshObject.isLoading || pointCloudObject.isLoading)) {
    isLoading = true;
  }

  /**
   * Handles the eye clicking functionality.
   * If the brain region mesh is already visible, it hides it in the mesh collection and removes it from the state
   * If the brain region mesh is not visible, it fetches it and adds it in the state
   */
  const onClickEye = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    // if the brain region mesh is already visible, remove it
    if (isVisible) {
      setAtlasVisualizationAtom({
        ...atlasVisualizationAtom,
        visibleMeshes: atlasVisualizationAtom.visibleMeshes.filter(
          (mesh) => mesh.contentURL !== distribution.contentUrl
        ),
        visiblePointClouds: atlasVisualizationAtom.visiblePointClouds.filter(
          (pointCloud) => pointCloud.regionID !== regionID
        ),
      });
    } else {
      setAtlasVisualizationAtom({
        ...atlasVisualizationAtom,
        visibleMeshes: [
          ...atlasVisualizationAtom.visibleMeshes,
          {
            contentURL: distribution.contentUrl,
            color: colorCode,
            isLoading: true,
            hasError: false,
          },
        ],
        visiblePointClouds: [
          ...atlasVisualizationAtom.visiblePointClouds,
          {
            regionID,
            color: colorCode,
            isLoading: true,
            hasError: false,
          },
        ],
      });
    }
  };

  // returns the icon to be rendered based on the current state of the button
  const icon = useMemo(() => {
    if (isLoading) {
      return <Icon spin component={LoadingIcon} />;
    }
    if (isVisible) {
      return <EyeOutlined style={{ color: 'white' }} />;
    }
    return <EyeInvisibleOutlined style={{ color: '#91D5FF' }} />;
  }, [isLoading, isVisible]);

  return (
    <Button
      className="border-none rounded-sm items-center text-primary-1 bg-transparent justify-center flex"
      type="text"
      onClick={onClickEye}
      icon={icon}
    />
  );
}
