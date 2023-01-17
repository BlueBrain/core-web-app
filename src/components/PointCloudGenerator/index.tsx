import { useCallback, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { Color } from 'three';
import { tableFromIPC } from '@apache-arrow/es5-cjs';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import AtlasVisualizationAtom from '@/state/atlas';
import { basePath } from '@/config';
import {
  CELL_API_BASE_PATH,
  CELL_API_INPUT_PATH,
} from '@/components/PointCloudGenerator/constants';
import useNotification from '@/hooks/notifications';

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

function PointCloudMesh({ regionID, color }: PointCloudMeshProps) {
  const atlasVisualizationAtom = useAtomValue(AtlasVisualizationAtom);
  const setAtlasVisualizationAtom = useSetAtom(AtlasVisualizationAtom);
  const addNotification = useNotification();

  // the index of the point cloud
  const pcIndex = useMemo(
    () =>
      atlasVisualizationAtom.visiblePointClouds.findIndex(
        (meshToFind) => meshToFind.regionID === regionID
      ),
    [atlasVisualizationAtom.visiblePointClouds, regionID]
  );

  /**
   * Sets the loading state to false
   */
  const disableLoadingState = useCallback(() => {
    if (atlasVisualizationAtom.visiblePointClouds[pcIndex].isLoading) {
      atlasVisualizationAtom.visiblePointClouds[pcIndex].isLoading = false;
      setAtlasVisualizationAtom({
        ...atlasVisualizationAtom,
        visiblePointClouds: atlasVisualizationAtom.visiblePointClouds,
      });
    }
  }, [atlasVisualizationAtom, pcIndex, setAtlasVisualizationAtom]);

  /**
   * Sets the error state of the object in jotai
   */
  const setErrorState = useCallback(
    (newState: boolean) => {
      atlasVisualizationAtom.visiblePointClouds[pcIndex].hasError = newState;
      setAtlasVisualizationAtom({
        ...atlasVisualizationAtom,
        visiblePointClouds: atlasVisualizationAtom.visiblePointClouds,
      });
    },
    [atlasVisualizationAtom, pcIndex, setAtlasVisualizationAtom]
  );

  /**
   * Fetches point cloud data from cells API. Returns the data in an array buffer format
   */
  const fetchData = useCallback(async () => {
    const url = `${CELL_API_BASE_PATH}/circuit?input_path=${encodeURIComponent(
      CELL_API_INPUT_PATH
    )}&region=${regionID}&how=arrow`;
    return fetch(url, {
      method: 'get',
      headers: new Headers({
        Accept: '*/*',
      }),
    }).then((response) => response.arrayBuffer());
  }, [regionID]);

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
    fetchData()
      .then(async (arrayBuffer) => {
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
        disableLoadingState();
      })
      .catch(() => {
        disableLoadingState();
        addNotification.error('Something went wrong while fetch point cloud mesh');
        setErrorState(true);
      });
  }, [addNotification, color, disableLoadingState, fetchData, regionID, setErrorState]);

  useEffect(() => {
    const pcObject = atlasVisualizationAtom.visiblePointClouds[pcIndex];
    if (pcObject?.hasError) return;
    const mc = threeCtxWrapper.getMeshCollection();
    if (mc.has(regionID)) {
      mc.show(regionID);
    } else {
      fetchAndShowPointCloud();
    }
  }, [atlasVisualizationAtom.visiblePointClouds, fetchAndShowPointCloud, pcIndex, regionID]);

  return null;
}

export default function PointCloudGenerator() {
  const shouldBeVisiblePointClouds = useAtomValue(AtlasVisualizationAtom).visiblePointClouds;
  return (
    <>
      {shouldBeVisiblePointClouds.map((pointCloud) => (
        <PointCloudMesh
          key={pointCloud.regionID}
          color={pointCloud.color}
          regionID={pointCloud.regionID}
        />
      ))}
    </>
  );
}
