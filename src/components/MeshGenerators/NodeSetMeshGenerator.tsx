import { useCallback, useEffect, useState } from 'react';
import { Color } from 'three';
import { tableFromIPC } from '@apache-arrow/es5-cjs';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { usePreventParallelism } from '@/hooks/parallelism';
import { useAtlasVisualizationManager } from '@/state/atlas';
import useNotification from '@/hooks/notifications';
import detailedCircuitAtom from '@/state/circuit';
import { ThreeCtxWrapper } from '@/visual/ThreeCtxWrapper';
import { atlasVisualizationAtom } from '@/state/atlas/atlas';
import { loadNodeSetsAsPoints, loadNodeSetsAsSpheres } from '@/components/MeshGenerators/utils';
import { CameraType } from '@/types/experiment-designer-visualization';

type NodeSetMeshProps = {
  nodeSetName: string;
  color: string;
  circuitConfigPathOverride?: string;
  threeContextWrapper: ThreeCtxWrapper;
  cameraType?: CameraType;
};

const CELL_API_BASE_PATH = 'https://cells.sbo.kcp.bbp.epfl.ch';

const detailedCircuitLoadableAtom = loadable(detailedCircuitAtom);

function NodeSetMesh({
  nodeSetName,
  color,
  circuitConfigPathOverride,
  threeContextWrapper,
  cameraType,
}: NodeSetMeshProps) {
  const preventParallelism = usePreventParallelism();
  const atlas = useAtlasVisualizationManager();
  const addNotification = useNotification();
  const detailedCircuit = useAtomValue(detailedCircuitLoadableAtom);

  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);

  /**
   * Fetches point cloud data from cells API. Returns the data in an array buffer format
   */
  const fetchData = useCallback(async () => {
    const detailedCircuitHasData =
      detailedCircuit.state === 'hasData' && detailedCircuit.data?.circuitConfigPath.url;

    if (!circuitConfigPathOverride && !detailedCircuitHasData) {
      throw new Error('Circuit config path is not found in the configuration');
    }

    const detailedCircuitConfigPath = detailedCircuitHasData
      ? detailedCircuit.data?.circuitConfigPath.url.replace('file://', '') || ''
      : '';

    const circuitConfigPath =
      typeof circuitConfigPathOverride !== 'undefined'
        ? circuitConfigPathOverride
        : detailedCircuitConfigPath;

    const url = `${CELL_API_BASE_PATH}/circuit?input_path=${encodeURIComponent(
      circuitConfigPath
    )}&node_set=${nodeSetName}&how=arrow&use_cache=True&sampling_ratio=0.01`;

    return fetch(url, {
      method: 'get',
      headers: new Headers({
        Accept: '*/*',
      }),
    }).then((response) => response.arrayBuffer());
  }, [circuitConfigPathOverride, detailedCircuit, nodeSetName]);

  const fetchAndShowNodeSets = useCallback(() => {
    // Prevent double loading.
    preventParallelism(nodeSetName, async () => {
      if (atlas.findVisibleNodeSet(nodeSetName)?.isLoading) return;

      console.debug('fetchAndShowNodeSets', nodeSetName);

      atlas.updateVisibleNodeSets({
        nodeSetName,
        isLoading: true,
        hasError: false,
      });

      try {
        const arrayBufferData = await fetchData();
        setArrayBuffer(arrayBufferData);
        //
      } catch (ex) {
        atlas.updateVisibleNodeSets({
          nodeSetName,
          isLoading: false,
          hasError: true,
        });
        addNotification.error('Something went wrong while fetching point cloud mesh');
      }
    });
  }, [preventParallelism, nodeSetName, atlas, fetchData, addNotification]);

  useEffect(() => {
    if (arrayBuffer !== null) {
      const isPerspectiveCameraActive = cameraType !== 'orthographic';
      const table = tableFromIPC(arrayBuffer);
      const points = table.toArray().map((elem, index) => {
        const dataStr = elem.toString();
        const data = JSON.parse(dataStr);
        const id = index;
        return { id, ...data };
      });

      const mesh = isPerspectiveCameraActive
        ? loadNodeSetsAsPoints(points, color)
        : loadNodeSetsAsSpheres(points, color);

      const meshCollection = threeContextWrapper.getMeshCollection();
      meshCollection.detach(nodeSetName);
      meshCollection.addOrShowMesh(nodeSetName, mesh);
      atlas.updateVisibleNodeSets({
        nodeSetName,
        isLoading: false,
        hasError: false,
      });
    }
  }, [arrayBuffer, atlas, cameraType, color, nodeSetName, threeContextWrapper]);

  useEffect(() => {
    const nodeSetObject = atlas.findVisibleNodeSet(nodeSetName);
    if (!nodeSetObject || nodeSetObject.hasError || !nodeSetName) return;

    const meshCollection = threeContextWrapper.getMeshCollection();

    if (meshCollection.has(nodeSetName)) {
      meshCollection.show(nodeSetName);
    } else if (detailedCircuit.state !== 'loading') {
      fetchAndShowNodeSets();
    }
  }, [atlas, detailedCircuit.state, fetchAndShowNodeSets, nodeSetName, threeContextWrapper]);

  useEffect(() => {
    const meshCollection = threeContextWrapper.getMeshCollection();
    // @ts-ignore
    const collection = meshCollection.collection[nodeSetName]; // todo fix it when MeshCollection.js is typed
    if (collection && collection.material && color) {
      collection.material.color = new Color(color);
    }
  }, [color, fetchAndShowNodeSets, nodeSetName, threeContextWrapper]);

  return null;
}

interface NodeSetMeshGeneratorProps {
  circuitConfigPathOverride?: string;
  threeContextWrapper: ThreeCtxWrapper;
  cameraType?: CameraType;
}

export default function NodeSetMeshGenerator({
  circuitConfigPathOverride,
  threeContextWrapper,
  cameraType,
}: NodeSetMeshGeneratorProps) {
  const atlasVisualization = useAtomValue(atlasVisualizationAtom);

  return (
    <>
      {atlasVisualization.visibleNodeSets.map((nodeSet) => (
        <NodeSetMesh
          key={nodeSet.nodeSetName}
          color={nodeSet.color}
          nodeSetName={nodeSet.nodeSetName}
          circuitConfigPathOverride={circuitConfigPathOverride}
          threeContextWrapper={threeContextWrapper}
          cameraType={cameraType}
        />
      ))}
    </>
  );
}
