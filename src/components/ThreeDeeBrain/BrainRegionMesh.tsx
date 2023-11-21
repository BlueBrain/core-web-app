import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { loadable } from 'jotai/utils';
import { useThree } from '@react-three/fiber';
import { ApplicationSection } from '@/types/common';
import { createMesh } from '@/components/ThreeDeeBrain/utils';
import {
  addLoadingAtom,
  addMeshVisibilityAtom,
  disableLoadingAtom,
  getMeshAtom,
} from '@/components/ThreeDeeBrain/state';

export function BrainRegionMesh({
  brainRegionId,
  section,
  color,
}: {
  brainRegionId: string;
  section: ApplicationSection;
  color?: string;
}) {
  const addLoading = useSetAtom(addLoadingAtom);
  const disableLoading = useSetAtom(disableLoadingAtom);

  const brainRegionMesh = useAtomValue(
    useMemo(() => loadable(getMeshAtom(brainRegionId)), [brainRegionId])
  );
  const addMeshVisibility = useSetAtom(addMeshVisibilityAtom);
  const { scene } = useThree();

  useEffect(() => {
    if (brainRegionMesh.state === 'loading') {
      addLoading(section, brainRegionId, 'mesh');
    }
    if (brainRegionMesh.state === 'hasError') {
      disableLoading(section, brainRegionId, 'mesh');
      return;
    }
    if (brainRegionMesh.state === 'hasData' && brainRegionMesh.data) {
      const mesh = createMesh(brainRegionMesh.data, color || '#FFF');
      scene.add(mesh);
      addMeshVisibility(section, brainRegionId, 'mesh', mesh.uuid);
      disableLoading(section, brainRegionId, 'mesh');
    }
  }, [
    addLoading,
    addMeshVisibility,
    brainRegionId,
    brainRegionMesh,
    color,
    disableLoading,
    scene,
    section,
  ]);

  return null;
}
