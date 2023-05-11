import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useAtlasVisualizationManager } from '@/state/atlas';
import MeshGenerators from '@/components/MeshGenerators';
import simPreviewThreeCtxWrapper from '@/components/experiment-designer/simulation-preview/SimulationPreview/SimPreviewThreeCtxWrapper';
import { getFocusedAtom } from '@/components/experiment-designer/utils';
import generateRandomColor from '@/components/experiment-designer/simulation-preview/PreviewMesh/generate-random-color';
import getSimulatedNeurons from '@/components/experiment-designer/simulation-preview/get-simulated-neurons';
import { nodeSetsPaletteAtom } from '@/components/experiment-designer/simulation-preview/atoms';

const setupAtom = getFocusedAtom('setup');

export default function PreviewMesh() {
  const atlas = useAtlasVisualizationManager();
  const [setup] = useAtom(setupAtom);
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
    const nodeSetsToAdd = getSimulatedNeurons(setup);
    const visibleObjectsToAdd = nodeSetsToAdd.map((nodeSetName: string) => ({
      nodeSetName,
      color: getNodeSetColor(nodeSetName),
      isLoading: false,
      hasError: false,
    }));
    atlas.removeAllNodeSetMeshes();
    atlas.addVisibleObjects(...visibleObjectsToAdd);
  }, [atlas, getNodeSetColor, setup]);

  return (
    <MeshGenerators
      threeContextWrapper={simPreviewThreeCtxWrapper}
      circuitConfigPathOverride="/gpfs/bbp.cscs.ch/project/proj134/workflow-outputs/31f221e1-33e0-4a0b-a570-e192c95c1674/morphologyAssignmentConfig/root/circuit_config.json"
    />
  );
}
