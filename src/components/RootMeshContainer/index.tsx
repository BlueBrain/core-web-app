import { useCallback, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import * as THREE from 'three';
import { useSession } from 'next-auth/react';

import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import AtlasMesh from '@/visual/meshcollection/AtlasMesh';

const parseWFObj = require('wavefront-obj-parser');

const contentURL =
  'https://bbp.epfl.ch/nexus/v1/files/bbp/atlas/00d2c212-fa1d-4f85-bd40-0bc217807f5b';

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

export const fetchAndAddMesh = (accessToken: string, distributionID: string, colorCode: string) =>
  fetch(distributionID, {
    method: 'get',
    headers: new Headers({
      'Access-Control-Allow-Origin': '*',
      Accept: '*/*',
      Authorization: `Bearer ${accessToken}`,
    }),
  })
    .then((response) => response.text())
    .then((data) => {
      const mesh = createMesh(data, { color: colorCode });
      const mc = threeCtxWrapper.getMeshCollection();
      // @ts-ignore
      mc.addOrShowMesh(distributionID, mesh, false);
    });

export default function RootMeshContainer() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  const fetchDataAPI = useCallback(() => {
    if (session?.user) {
      fetchAndAddMesh(session.accessToken, contentURL, '#FFF').then(() => setIsLoading(false));
    }
  }, [session]);

  useEffect(() => fetchDataAPI());

  if (isLoading) {
    return (
      <div className="z-50 text-neutral-1 text-4xl absolute inset-1/2">
        <LoadingOutlined />
      </div>
    );
  }
  return null;
}
