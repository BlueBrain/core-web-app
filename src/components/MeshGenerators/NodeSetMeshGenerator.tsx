import { useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { Color } from 'three';
import { tableFromIPC } from '@apache-arrow/es5-cjs';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { usePreventParallelism } from '@/hooks/parallelism';
import { useAtlasVisualizationManager } from '@/state/atlas';
import { basePath } from '@/config';
import useNotification from '@/hooks/notifications';
import detailedCircuitAtom from '@/state/circuit';
import { ThreeCtxWrapper } from '@/visual/ThreeCtxWrapper';

type NodeSetMeshProps = {
  nodeSetName: string;
  color: string;
  circuitConfigPathOverride?: string;
  threeContextWrapper: ThreeCtxWrapper;
};

type Point = {
  id: number;
  mtype: string;
  region: string;
  x: number;
  y: number;
  z: number;
};

const CELL_API_BASE_PATH = 'https://cells.sbo.kcp.bbp.epfl.ch';

const detailedCircuitLoadableAtom = loadable(detailedCircuitAtom);

function NodeSetMesh({
  nodeSetName,
  color,
  circuitConfigPathOverride,
  threeContextWrapper,
}: NodeSetMeshProps) {
  const preventParallelism = usePreventParallelism();
  const atlas = useAtlasVisualizationManager();
  const addNotification = useNotification();
  const detailedCircuit = useAtomValue(detailedCircuitLoadableAtom);

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
    )}&node_set=${nodeSetName}&how=arrow&use_cache=False&sampling_ratio=0.01`;

    return fetch(url, {
      method: 'get',
      headers: new Headers({
        Accept: '*/*',
      }),
    }).then((response) => response.arrayBuffer());
  }, [circuitConfigPathOverride, detailedCircuit, nodeSetName]);

  /**
   * Builds the geometry of the point cloud
   * @param points
   */
  const buildGeometry = (points: Point[]) => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    points.forEach((elem) => {
      const { x, y, z } = elem;
      vertices.push(x, y, z);
    });
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeBoundingSphere();
    return geometry;
  };

  const fetchAndShowNodeSets = useCallback(() => {
    // Prevent double loading.
    preventParallelism(nodeSetName, async () => {
      if (atlas.findVisibleNodeSet(nodeSetName)?.isLoading) return;

      atlas.updateVisibleNodeSets({
        nodeSetName,
        isLoading: true,
        hasError: false,
      });

      try {
        const arrayBuffer = await fetchData();
        const table = tableFromIPC(arrayBuffer);
        const points = table.toArray().map((elem, index) => {
          const dataStr = elem.toString();
          const data = JSON.parse(dataStr);
          const id = index;
          return { id, ...data };
        });
        const sprite = new THREE.TextureLoader().load(`${basePath}/images/disc.png`);
        const material = new THREE.PointsMaterial({
          color: new Color(color),
          size: 400,
          map: sprite,
          sizeAttenuation: true,
          alphaTest: 0.5,
          transparent: true,
        });
        const geometry = buildGeometry(points);
        const mesh = new THREE.Points(geometry, material);
        const meshCollection = threeContextWrapper.getMeshCollection();
        meshCollection.addOrShowMesh(nodeSetName, mesh);
        atlas.updateVisibleNodeSets({
          nodeSetName,
          isLoading: false,
          hasError: false,
        });
      } catch (ex) {
        atlas.updateVisibleNodeSets({
          nodeSetName,
          isLoading: false,
          hasError: true,
        });
        addNotification.error('Something went wrong while fetching point cloud mesh');
      }
    });
  }, [
    preventParallelism,
    nodeSetName,
    atlas,
    fetchData,
    color,
    threeContextWrapper,
    addNotification,
  ]);

  useEffect(() => {
    const nodeSetObject = atlas.findVisibleNodeSet(nodeSetName);
    if (!nodeSetObject || nodeSetObject.hasError) return;

    const meshCollection = threeContextWrapper.getMeshCollection();
    if (meshCollection.has(nodeSetName)) {
      meshCollection.show(nodeSetName);
    } else if (detailedCircuit.state !== 'loading') {
      fetchAndShowNodeSets();
    }
  }, [atlas, detailedCircuit.state, fetchAndShowNodeSets, nodeSetName, threeContextWrapper]);

  return null;
}

interface NodeSetMeshGeneratorProps {
  circuitConfigPathOverride?: string;
  threeContextWrapper: ThreeCtxWrapper;
}

export default function NodeSetMeshGenerator({
  circuitConfigPathOverride,
  threeContextWrapper,
}: NodeSetMeshGeneratorProps) {
  const { visibleNodeSets } = useAtlasVisualizationManager();

  return (
    <>
      {visibleNodeSets.map((nodeSet) => (
        <NodeSetMesh
          key={nodeSet.nodeSetName}
          color={nodeSet.color}
          nodeSetName={nodeSet.nodeSetName}
          circuitConfigPathOverride={circuitConfigPathOverride}
          threeContextWrapper={threeContextWrapper}
        />
      ))}
    </>
  );
}
