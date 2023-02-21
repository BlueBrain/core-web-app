import * as THREE from 'three';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { usePreventParallelism } from '../../hooks/parallelism';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import AtlasMesh from '@/visual/meshcollection/AtlasMesh';
import { useAtlasVisualizationManager } from '@/state/atlas';
import { createHeaders } from '@/util/utils';
import useNotification from '@/hooks/notifications';

const parseWFObj = require('wavefront-obj-parser');

type BrainRegionMeshProps = {
  id: string;
  colorCode: string;
};

/**
 * Creates the and returns the mesh object
 * @param data
 * @param options
 */
const createMesh = (data: string, options: object) => {
  const meshData = parseWFObj(data);
  // the lib leaves room for 4-vertices faces by adding -1
  const indices = new Uint32Array(meshData.vertexPositionIndices.filter((v: number) => v >= 0));
  const positions = new Float32Array(meshData.vertexPositions);
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.computeBoundingSphere();
  geometry.computeVertexNormals();
  return new AtlasMesh(geometry, options);
};

/**
 * Fetches the mesh data from nexus
 * @param accessToken
 * @param distributionID
 */
const fetchMesh = (accessToken: string, distributionID: string) =>
  fetch(distributionID, {
    method: 'get',
    headers: createHeaders(accessToken),
  }).then((response) => response.text());

export default function BrainRegionMesh({ id, colorCode }: BrainRegionMeshProps) {
  const preventPrallelism = usePreventParallelism();
  const { data: session } = useSession();
  const atlas = useAtlasVisualizationManager();
  const addNotification = useNotification();

  /**
   * Fetches the data from the API
   */
  const fetchDataAPI = useCallback(() => {
    preventPrallelism(id, async () => {
      if (session?.user && session?.accessToken) {
        // Prevent from double loading.
        if (atlas.findVisibleMesh(id)?.isLoading) return;

        atlas.updateVisibleMesh({ contentURL: id, isLoading: true });
        try {
          const data = await fetchMesh(session.accessToken, id);
          const mesh = createMesh(data, { color: colorCode });
          const mc = threeCtxWrapper.getMeshCollection();
          mc.addOrShowMesh(id, mesh, false);
          atlas.updateVisibleMesh({ contentURL: id, isLoading: false, hasError: false });
        } catch (ex) {
          addNotification.error('Something went wrong while fetching brain region mesh');
          atlas.updateVisibleMesh({ contentURL: id, isLoading: false, hasError: true });
        }
      }
    });
  }, [preventPrallelism, id, session, atlas, colorCode, addNotification]);

  useEffect(() => {
    const meshObject = atlas.findVisibleMesh(id);
    if (meshObject?.hasError) return;

    const mc = threeCtxWrapper.getMeshCollection();
    // if the mesh already exists in the mesh collection, it is shown. If not, it is fetched
    if (mc.has(id)) {
      mc.show(id);
    } else {
      fetchDataAPI();
    }
  }, [atlas, fetchDataAPI, id]);

  return null;
}
