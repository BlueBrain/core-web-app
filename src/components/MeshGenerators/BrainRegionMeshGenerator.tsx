import {
  BufferAttribute as ThreeBufferAttribute,
  BufferGeometry as ThreeBufferGeometry,
} from 'three';
import { useAtomValue } from 'jotai';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';

import { usePreventParallelism } from '@/hooks/parallelism';
import AtlasMesh from '@/visual/meshcollection/AtlasMesh';
import { useAtlasVisualizationManager } from '@/state/atlas';
import { createHeaders } from '@/util/utils';
import useNotification from '@/hooks/notifications';
import { ThreeCtxWrapper } from '@/visual/ThreeCtxWrapper';
import { atlasVisualizationAtom } from '@/state/atlas/atlas';

const parseWFObj = require('wavefront-obj-parser');

type BrainRegionMeshProps = {
  id: string;
  colorCode: string;
  threeContextWrapper: ThreeCtxWrapper;
};

interface MeshGeneratorProps {
  threeContextWrapper: ThreeCtxWrapper;
}

function BrainRegionMesh({ id, colorCode, threeContextWrapper }: BrainRegionMeshProps) {
  const preventParallelism = usePreventParallelism();
  const { data: session } = useSession();
  const atlas = useAtlasVisualizationManager();
  const addNotification = useNotification();

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
    const geometry = new ThreeBufferGeometry();
    geometry.setIndex(new ThreeBufferAttribute(indices, 1));
    geometry.setAttribute('position', new ThreeBufferAttribute(positions, 3));
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

  /**
   * Fetches the data from the API
   */
  const fetchDataAPI = useCallback(() => {
    preventParallelism(id, async () => {
      if (session?.user && session?.accessToken) {
        // Prevent from double loading.
        if (atlas.findVisibleMesh(id)?.isLoading) return;

        atlas.updateVisibleMesh({ contentURL: id, isLoading: true });
        try {
          const data = await fetchMesh(session.accessToken, id);
          const mesh = createMesh(data, { color: colorCode });
          const meshCollection = threeContextWrapper.getMeshCollection();
          meshCollection.addOrShowMesh(id, mesh, false);
          atlas.updateVisibleMesh({ contentURL: id, isLoading: false, hasError: false });
        } catch (ex) {
          addNotification.error('Something went wrong while fetching brain region mesh');
          atlas.updateVisibleMesh({ contentURL: id, isLoading: false, hasError: true });
        }
      }
    });
  }, [
    preventParallelism,
    id,
    session?.user,
    session?.accessToken,
    atlas,
    colorCode,
    threeContextWrapper,
    addNotification,
  ]);

  useEffect(() => {
    const meshObject = atlas.findVisibleMesh(id);
    if (meshObject?.hasError) return;

    const meshCollection = threeContextWrapper.getMeshCollection();
    // if the mesh already exists in the mesh collection, it is shown. If not, it is fetched
    if (meshCollection.has(id)) {
      meshCollection.show(id);
    } else {
      fetchDataAPI();
    }
  }, [atlas, fetchDataAPI, id, threeContextWrapper]);

  return null;
}

export default function BrainRegionMeshGenerator({ threeContextWrapper }: MeshGeneratorProps) {
  const atlasVisualization = useAtomValue(atlasVisualizationAtom);

  return (
    <>
      {atlasVisualization.visibleMeshes.map((mesh) => (
        <BrainRegionMesh
          key={mesh.contentURL}
          id={mesh.contentURL}
          colorCode={mesh.color}
          threeContextWrapper={threeContextWrapper}
        />
      ))}
    </>
  );
}
