import { EyeFilled, LoadingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import AtlasVisualizationAtom from '@/state/atlas';
import styles from './brain-region-mesh-trigger.module.css';

type BrainRegionMeshTriggerProps = {
  distribution: Distribution;
  colorCode: string;
};

export type Distribution = {
  name: string;
  content_url: string;
  encoding_format: string;
  content_size: string;
  data_sample_modality?: string;
};

export default function BrainRegionMeshTrigger({
  distribution,
  colorCode,
}: BrainRegionMeshTriggerProps) {
  const { visibleMeshes } = useAtomValue(AtlasVisualizationAtom);
  const isVisible =
    visibleMeshes.filter((mesh) => mesh.contentURL === distribution.content_url).length > 0;
  const setAtlasVisualizationAtom = useSetAtom(AtlasVisualizationAtom);
  const meshObject = visibleMeshes.find(
    (meshToFind) => meshToFind.contentURL === distribution.content_url
  );
  let isLoading = false;
  if (meshObject && meshObject.isLoading) {
    isLoading = true;
  }

  /**
   * Handles the eye clicking functionality.
   * If the brain region mesh is already visible, it hides it in the mesh collection and removes it from the state
   * If the brain region mesh is not visible, it fetches it and adds it in the state
   * @param contentUrl
   */
  const onClickEye = (contentUrl: string) => {
    // if the brain region mesh is already visible, remove it
    if (isVisible) {
      setAtlasVisualizationAtom({
        visibleMeshes: visibleMeshes.filter((mesh) => mesh.contentURL !== distribution.content_url),
      });
    } else {
      visibleMeshes.push({ contentURL: contentUrl, color: colorCode, isLoading: true });
      setAtlasVisualizationAtom({
        visibleMeshes,
      });
    }
  };

  return (
    <div>
      <Button
        className={`${styles.buttonTrigger} border-none text-primary-1 ${
          isVisible ? 'bg-primary-5' : 'bg-primary-6'
        }`}
        onClick={() => onClickEye(distribution.content_url)}
        icon={
          isLoading ? (
            <Spin indicator={<LoadingOutlined />} className="text-neutral-1" />
          ) : (
            <EyeFilled className="text-primary-1" />
          )
        }
      />
    </div>
  );
}
