'use client';

import { useAtomValue, useSetAtom } from 'jotai/react';
import { useEffect } from 'react';
import ThreeDeeView from '@/components/ThreeDeeView';
import AtlasVisualizationAtom from '@/state/atlas';

export default function InteractiveView() {
  const setAtlasVisualizationAtom = useSetAtom(AtlasVisualizationAtom);
  const atlasVisualizationAtom = useAtomValue(AtlasVisualizationAtom);

  useEffect(() => {
    // sets the mesh values to loading when the component is initialized for the first time.
    // this is done so that when we change between tabs, the loader will be shown
    setAtlasVisualizationAtom({
      visiblePointClouds: atlasVisualizationAtom.visiblePointClouds.map((pointCloud) => ({
        ...pointCloud,
        isLoading: true,
      })),
      visibleMeshes: atlasVisualizationAtom.visibleMeshes.map((mesh) => ({
        ...mesh,
        isLoading: true,
      })),
    });
  }, []);

  return <ThreeDeeView />;
}
