import { useCallback, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import {
  Color as Threecolor,
  Points as ThreePoints,
  PointsMaterial as ThreePointsMaterial,
  TextureLoader as ThreeTextureLoader,
} from 'three';
import { tableFromIPC } from '@apache-arrow/es2015-esm';
import { loadable } from 'jotai/utils';
import { usePreventParallelism } from '@/hooks/parallelism';
import { useAtlasVisualizationManager } from '@/state/atlas';
import { basePath } from '@/config';
import useNotification from '@/hooks/notifications';
import detailedCircuitAtom from '@/state/circuit';
import { ThreeCtxWrapper } from '@/visual/ThreeCtxWrapper';
import { atlasVisualizationAtom, PointCloudType } from '@/state/atlas/atlas';
import { buildGeometry } from '@/components/MeshGenerators/utils';

type PointCloudMeshProps = {
  regionID: string;
  color: string;
  circuitConfigPathOverride?: string;
  threeContextWrapper: ThreeCtxWrapper;
};

const CELL_API_BASE_PATH = 'https://cells.sbo.kcp.bbp.epfl.ch';

const detailedCircuitLoadableAtom = loadable(detailedCircuitAtom);

function PointCloudMesh({
  regionID,
  color,
  circuitConfigPathOverride,
  threeContextWrapper,
}: PointCloudMeshProps) {
  const preventParallelism = usePreventParallelism();
  const atlas = useAtlasVisualizationManager();
  const { warning, error } = useNotification();
  const detailedCircuit = useAtomValue(detailedCircuitLoadableAtom);

  /**
   * Fetches point cloud data from cells API. Returns the data in an array buffer format
   */
  const fetchData = useCallback(async () => {
    const detailedCircuitHasData =
      detailedCircuit.state === 'hasData' && detailedCircuit.data?.circuitConfigPath.url;

    if (!circuitConfigPathOverride && !detailedCircuitHasData) {
      throw new Error('The Circuit config path could not be found in the configuration.');
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
    )}&region=${regionID}&how=arrow`;
    return fetch(url, {
      method: 'get',
      headers: new Headers({
        Accept: '*/*',
      }),
    }).then((response) => response.arrayBuffer());
  }, [circuitConfigPathOverride, detailedCircuit, regionID]);

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
        const sprite = new ThreeTextureLoader().load(`${basePath}/images/disc.png`);
        const material = new ThreePointsMaterial({
          color: new Threecolor(color),
          size: 400,
          map: sprite,
          sizeAttenuation: true,
          alphaTest: 0.5,
          transparent: true,
        });
        const geometry = buildGeometry(points);
        const mesh = new ThreePoints(geometry, material);
        const meshCollection = threeContextWrapper.getMeshCollection();
        meshCollection.addOrShowMesh(regionID, mesh);
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
        if (
          ex instanceof Error &&
          ex.message.includes('The Circuit config path could not be found in the configuration.')
        ) {
          warning(
            'The cell positions cannot be displayed because the brain model has not been built yet.',
            undefined,
            'topRight',
            'cell-position-display-warning'
          );
        } else {
          error('Something went wrong while parsing point cloud mesh');
        }
      }
    });
  }, [preventParallelism, regionID, atlas, fetchData, color, threeContextWrapper, warning, error]);

  useEffect(() => {
    const pcObject = atlas.findVisiblePointCloud(regionID);
    if (!pcObject || pcObject.hasError) return;

    const meshCollection = threeContextWrapper.getMeshCollection();
    if (meshCollection.has(regionID)) {
      meshCollection.show(regionID);
    } else if (detailedCircuit.state !== 'loading') {
      fetchAndShowPointCloud();
    }
  }, [atlas, detailedCircuit.state, fetchAndShowPointCloud, regionID, threeContextWrapper]);

  return null;
}

interface PointCloudGeneratorProps {
  circuitConfigPathOverride?: string;
  threeContextWrapper: ThreeCtxWrapper;
}

export default function PointCloudGenerator({
  circuitConfigPathOverride,
  threeContextWrapper,
}: PointCloudGeneratorProps) {
  const atlasVisualization = useAtomValue(atlasVisualizationAtom);

  return (
    <>
      {atlasVisualization.visiblePointClouds.map((pointCloud: PointCloudType) => (
        <PointCloudMesh
          key={pointCloud.regionID}
          color={pointCloud.color}
          regionID={pointCloud.regionID}
          circuitConfigPathOverride={circuitConfigPathOverride}
          threeContextWrapper={threeContextWrapper}
        />
      ))}
    </>
  );
}
