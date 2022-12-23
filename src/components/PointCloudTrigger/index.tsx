import { Button, Spin } from 'antd';
import { CloudFilled, LoadingOutlined } from '@ant-design/icons';
import { useAtomValue, useSetAtom } from 'jotai';
import AtlasVisualizationAtom from '@/state/atlas';
import styles from '@/components/BrainRegionMeshTrigger/brain-region-mesh-trigger.module.css';

type PointCloudTriggerProps = {
  regionID: string;
  color: string;
};

export default function PointCloudTrigger({ regionID, color }: PointCloudTriggerProps) {
  const atlasVisualizationAtom = useAtomValue(AtlasVisualizationAtom);
  const setAtlasVisualizationAtom = useSetAtom(AtlasVisualizationAtom);
  const isVisible =
    atlasVisualizationAtom.visiblePointClouds.filter(
      (pointCloud) => pointCloud.regionID === regionID
    ).length > 0;
  const meshObject = atlasVisualizationAtom.visiblePointClouds.find(
    (pointCloud) => pointCloud.regionID === regionID
  );
  let isLoading = false;
  if (meshObject && meshObject.isLoading) {
    isLoading = true;
  }

  const onClickEye = () => {
    // if the point cloud is already visible, remove it
    if (isVisible) {
      setAtlasVisualizationAtom({
        ...atlasVisualizationAtom,
        visiblePointClouds: atlasVisualizationAtom.visiblePointClouds.filter(
          (pointCloud) => pointCloud.regionID !== regionID
        ),
      });
    } else {
      atlasVisualizationAtom.visiblePointClouds.push({
        regionID,
        color,
        isLoading: true,
      });
      setAtlasVisualizationAtom({
        ...atlasVisualizationAtom,
        visiblePointClouds: atlasVisualizationAtom.visiblePointClouds,
      });
    }
  };

  return (
    <Button
      className={`${styles.buttonTrigger} border-none text-primary-1 ${
        isVisible ? 'bg-primary-5' : 'bg-primary-6'
      }`}
      onClick={() => onClickEye()}
      icon={
        isLoading ? (
          <Spin indicator={<LoadingOutlined />} className="text-neutral-1" />
        ) : (
          <CloudFilled className="text-primary-1" />
        )
      }
      disabled={isLoading}
    />
  );
}
