import { EyeFilled, EyeInvisibleFilled, LoadingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { useState } from 'react';
import { fetchAndAddMesh } from '@/components/RootMeshContainer';
import { useLoginAtomValue } from '@/atoms/login';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import styles from './brain-region-mesh-trigger.module.css';

type BrainRegionMeshTriggerProps = {
  distribution?: Distribution;
  colorCode: string;
  visibleMeshes: string[];
  updateVisibleMeshes: (updatedMeshes: string[]) => void;
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
  visibleMeshes,
  updateVisibleMeshes,
}: BrainRegionMeshTriggerProps) {
  const login = useLoginAtomValue();
  const [isFetching, setIsFetching] = useState<boolean | undefined>(undefined);

  /**
   * Fetches the mesh and handles the fetching state
   * @param accessToken
   * @param contentUrl
   */
  const fetchMesh = (accessToken: string, contentUrl: string) => {
    setIsFetching(true);
    fetchAndAddMesh(accessToken, contentUrl, colorCode).then(() => setIsFetching(false));
  };

  /**
   * Handles the eye clicking functionality.
   * If the brain region mesh is already visible, it hides it in the mesh collection and removes it from the state
   * If the brain region mesh is not visible, it fetches it and adds it in the state
   *
   * @param accessToken
   * @param contentUrl
   */
  const onClickEye = (accessToken: string, contentUrl: string) => {
    // if the brain region mesh is already visible, hides it
    if (visibleMeshes.includes(contentUrl)) {
      const mc = threeCtxWrapper.getMeshCollection();
      // @ts-ignore
      mc.hide(contentUrl);
      const updatedMeshes = visibleMeshes.filter((mesh) => mesh !== contentUrl);
      updateVisibleMeshes(updatedMeshes);
    } else {
      fetchMesh(accessToken, contentUrl);
      visibleMeshes.push(contentUrl);
      updateVisibleMeshes(visibleMeshes);
    }
  };

  let isVisible;
  if (distribution) {
    isVisible = visibleMeshes.includes(distribution.content_url);
  } else {
    isVisible = false;
  }

  return (
    <div>
      {login && distribution ? (
        <Button
          className={`${styles.buttonTrigger} border-none text-primary-1 ${
            isVisible ? 'bg-primary-5' : 'bg-primary-6'
          }`}
          onClick={() => onClickEye(login?.accessToken, distribution.content_url)}
          icon={
            isFetching ? (
              <Spin indicator={<LoadingOutlined />} />
            ) : (
              <EyeFilled className="text-primary-1" />
            )
          }
          disabled={isFetching}
        />
      ) : (
        <Button
          className={`${styles.buttonTrigger} cursor-not-allowed bg-primary-6 border-none`}
          icon={<EyeInvisibleFilled className="text-error" />}
        />
      )}
    </div>
  );
}
