import { useEffect, useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useThree } from '@react-three/fiber';
import useNotification from '@/hooks/notifications';
import { createPointCloud } from '@/components/ThreeDeeBrain/utils';
import { ApplicationSection } from '@/types/common';
import {
  addLoadingAtom,
  addMeshVisibilityAtom,
  disableLoadingAtom,
  getPointCloudAtom,
} from '@/components/ThreeDeeBrain/state';
import { BRAIN_REGION_DOES_NOT_EXIST, CIRCUIT_NOT_BUILT_ERROR } from '@/constants/errors';

type PointCloudMeshProps = {
  brainRegionId: string;
  section: ApplicationSection;
  color?: string;
};

export function PointCloudMesh({ brainRegionId, section, color }: PointCloudMeshProps) {
  const { info } = useNotification();
  const { scene } = useThree();
  const addLoading = useSetAtom(addLoadingAtom);
  const disableLoading = useSetAtom(disableLoadingAtom);
  const addMeshVisibility = useSetAtom(addMeshVisibilityAtom);

  const pointCloudData = useAtomValue(
    useMemo(() => loadable(getPointCloudAtom(brainRegionId)), [brainRegionId])
  );
  useEffect(() => {
    if (pointCloudData.state === 'loading') {
      addLoading(section, brainRegionId, 'pointCloud');
    }
    if (pointCloudData.state === 'hasError') {
      if ((pointCloudData.error as Error).message === CIRCUIT_NOT_BUILT_ERROR) {
        info(
          'The cell positions cannot be displayed because the brain model has not been built yet.',
          5,
          'topRight',
          true,
          'point-cloud-warning'
        );
      } else if ((pointCloudData.error as Error).message === BRAIN_REGION_DOES_NOT_EXIST) {
        info(
          'The selected brain region can not be visualised',
          5,
          'topRight',
          true,
          'point-cloud-warning'
        );
      } else {
        info(
          'Something went wrong when trying to visualize the brain region',
          5,
          'topRight',
          true,
          'point-cloud-warning'
        );
      }
      disableLoading(section, brainRegionId, 'pointCloud');
      return;
    }
    if (pointCloudData.state === 'hasData' && pointCloudData.data) {
      const pointCloud3DObject = createPointCloud(pointCloudData.data, color || '#FFF');
      addMeshVisibility(section, brainRegionId, 'pointCloud', pointCloud3DObject.uuid);
      scene.add(pointCloud3DObject);
      disableLoading(section, brainRegionId, 'pointCloud');
    }
  }, [
    addLoading,
    addMeshVisibility,
    brainRegionId,
    color,
    disableLoading,
    info,
    pointCloudData,
    scene,
    section,
  ]);

  return null;
}
