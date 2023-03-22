import { useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { Color } from 'three';
import { tableFromIPC } from '@apache-arrow/es5-cjs';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { usePreventParallelism } from '@/hooks/parallelism';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import { useAtlasVisualizationManager } from '@/state/atlas';
import { basePath } from '@/config';
import CELL_API_BASE_PATH from '@/components/PointCloudGenerator/constants';
import useNotification from '@/hooks/notifications';
import detailedCircuitAtom from '@/state/circuit';

type PointCloudMeshProps = {
  regionID: string;
  color: string;
};

type Point = {
  id: number;
  mtype: string;
  region: string;
  x: number;
  y: number;
  z: number;
};

const detailedCircuitLoadableAtom = loadable(detailedCircuitAtom);

function PointCloudMesh({ regionID, color }: PointCloudMeshProps) {
  const preventParallelism = usePreventParallelism();
  const atlas = useAtlasVisualizationManager();
  const addNotification = useNotification();
  const detailedCircuit = useAtomValue(detailedCircuitLoadableAtom);

  /**
   * Fetches point cloud data from cells API. Returns the data in an array buffer format
   */
  const fetchData = useCallback(async () => {
    if (detailedCircuit.state !== 'hasData' || !detailedCircuit.data?.circuitConfigPath.url) {
      throw new Error('Circuit config path is not found in the configuration');
    }

    const circuitConfigPath = detailedCircuit.data?.circuitConfigPath.url.replace('file://', '');
    const url = `${CELL_API_BASE_PATH}/circuit?input_path=${encodeURIComponent(
      circuitConfigPath
    )}&region=${regionID}&how=arrow`;
    return fetch(url, {
      method: 'get',
      headers: new Headers({
        Accept: '*/*',
      }),
    }).then((response) => response.arrayBuffer());
  }, [detailedCircuit, regionID]);

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

  const fetchAndShowPointCloud = useCallback(() => {
    // Prevent double loading.
    preventParallelism(regionID, async () => {
      if (atlas.findVisiblePointCloud(regionID)?.isLoading) return;

      atlas.updateVisiblePointCloud({
        regionID,
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
        const mc = threeCtxWrapper.getMeshCollection();
        mc.addOrShowMesh(regionID, mesh);
        atlas.updateVisiblePointCloud({
          regionID,
          isLoading: false,
          hasError: false,
        });
      } catch (ex) {
        atlas.updateVisiblePointCloud({
          regionID,
          isLoading: false,
          hasError: true,
        });
        addNotification.error('Something went wrong while fetching point cloud mesh');
      }
    });
  }, [preventParallelism, regionID, atlas, fetchData, color, addNotification]);

  useEffect(() => {
    const pcObject = atlas.findVisiblePointCloud(regionID);
    if (!pcObject || pcObject.hasError) return;

    const mc = threeCtxWrapper.getMeshCollection();
    if (mc.has(regionID)) {
      mc.show(regionID);
    } else if (detailedCircuit.state !== 'loading') {
      fetchAndShowPointCloud();
    }
  }, [atlas, detailedCircuit.state, fetchAndShowPointCloud, regionID]);

  return null;
}

export default function PointCloudGenerator() {
  const { visiblePointClouds } = useAtlasVisualizationManager();
  return (
    <>
      {visiblePointClouds.map((pointCloud) => (
        <PointCloudMesh
          key={pointCloud.regionID}
          color={pointCloud.color}
          regionID={pointCloud.regionID}
        />
      ))}
    </>
  );
}
