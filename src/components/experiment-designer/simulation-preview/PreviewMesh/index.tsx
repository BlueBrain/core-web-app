import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useAtlasVisualizationManager } from '@/state/atlas';
import MeshGenerators from '@/components/MeshGenerators';
import simPreviewThreeCtxWrapper from '@/components/experiment-designer/simulation-preview/SimulationPreview/SimPreviewThreeCtxWrapper';
import generateRandomColor from '@/components/experiment-designer/simulation-preview/PreviewMesh/generate-random-color';
import { nodeSetsPaletteAtom } from '@/components/experiment-designer/simulation-preview/atoms';
import { TargetList } from '@/types/experiment-designer';

interface PreviewMeshProps {
  targetsToDisplay: TargetList;
}

export default function PreviewMesh({ targetsToDisplay }: PreviewMeshProps) {
  const atlas = useAtlasVisualizationManager();
  const [nodeSetsPalette, setNodeSetsPalette] = useAtom(nodeSetsPaletteAtom);

  // make should be visible meshes a union of both meshes and point clouds
  const shouldBeVisibleMeshes = atlas.visibleMeshes.map((mesh) => mesh.contentURL);
  const shouldBeVisiblePointClouds = atlas.visiblePointClouds.map((cloud) => cloud.regionID);
  const shouldBeVisible = shouldBeVisiblePointClouds.concat(shouldBeVisibleMeshes);
  const meshCollection = simPreviewThreeCtxWrapper.getMeshCollection();
  const currentlyVisible = meshCollection.getAllVisibleMeshes();

  currentlyVisible.forEach((meshID) => {
    const meshShouldBeVisible = shouldBeVisible.includes(meshID);
    if (!meshShouldBeVisible) {
      meshCollection.hide(meshID);
    }
  });

  const getNodeSetColor = useCallback(
    (nodeSetName: string) => {
      // Randomize color or get it from already created palette ("temporary" solution for the time being)
      let color = nodeSetsPalette[nodeSetName];
      if (!color) {
        color = generateRandomColor();
        setNodeSetsPalette({ ...nodeSetsPalette, [nodeSetName]: color });
      }
      return color;
    },
    [nodeSetsPalette, setNodeSetsPalette]
  );

  useEffect(() => {
    const visibleObjectsToAdd = targetsToDisplay.map((targetName: string) => ({
      nodeSetName: targetName,
      color: getNodeSetColor(targetName),
      isLoading: false,
      hasError: false,
    }));
    atlas.removeAllNodeSetMeshes();
    atlas.addVisibleObjects(...visibleObjectsToAdd);
    return () => {
      atlas.removeAllNodeSetMeshes();
    };
  }, [atlas, getNodeSetColor, targetsToDisplay]);

  return (
    <MeshGenerators
      threeContextWrapper={simPreviewThreeCtxWrapper}
      circuitConfigPathOverride="/gpfs/bbp.cscs.ch/project/proj134/workflow-outputs/31f221e1-33e0-4a0b-a570-e192c95c1674/morphologyAssignmentConfig/root/circuit_config.json"
    />
  );
}
