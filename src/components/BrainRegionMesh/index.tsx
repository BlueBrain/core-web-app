import * as THREE from 'three';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai/react';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import AtlasMesh from '@/visual/meshcollection/AtlasMesh';
import AtlasVisualizationAtom from '@/state/atlas';
import { createHeaders } from '@/util/utils';

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
  const { data: session } = useSession();
  const atlasVisualizationAtom = useAtomValue(AtlasVisualizationAtom);
  const setAtlasVisualizationAtom = useSetAtom(AtlasVisualizationAtom);

  /**
   * Sets the loading state to false
   */
  const disableLoadingState = useCallback(() => {
    const meshIndex = atlasVisualizationAtom.visibleMeshes.findIndex(
      (meshToFind) => meshToFind.contentURL === id
    );
    if (atlasVisualizationAtom.visibleMeshes[meshIndex].isLoading) {
      atlasVisualizationAtom.visibleMeshes[meshIndex].isLoading = false;
      setAtlasVisualizationAtom({
        ...atlasVisualizationAtom,
        visibleMeshes: atlasVisualizationAtom.visibleMeshes,
      });
    }
  }, [atlasVisualizationAtom, id, setAtlasVisualizationAtom]);

  /**
   * Fetches the data from the API
   */
  const fetchDataAPI = useCallback(() => {
    if (session?.user && session?.accessToken) {
      fetchMesh(session.accessToken, id)
        .then((data) => {
          const mesh = createMesh(data, { color: colorCode });
          const mc = threeCtxWrapper.getMeshCollection();
          mc.addOrShowMesh(id, mesh, false);
          disableLoadingState();
        })
        .catch(() => disableLoadingState());
    }
  }, [colorCode, disableLoadingState, id, session?.accessToken, session?.user]);

  useEffect(() => {
    const mc = threeCtxWrapper.getMeshCollection();
    // if the mesh already exists in the mesh collection, it is shown. If not, it is fetched
    if (mc.has(id)) {
      mc.show(id);
      disableLoadingState();
    } else {
      fetchDataAPI();
    }
  }, [id, colorCode, fetchDataAPI, disableLoadingState]);

  return null;
}
