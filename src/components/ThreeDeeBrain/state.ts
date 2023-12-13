import { atom } from 'jotai';
import { atomFamily, atomWithReset } from 'jotai/utils';
import sessionAtom from '@/state/session';
import { meshDistributionsAtom } from '@/state/brain-regions';
import { ApplicationSection } from '@/types/common';
import { LoadingState, MeshVisibility, VisibilityType } from '@/components/ThreeDeeBrain/types';
import { BRAIN_REGION_PREFIX } from '@/constants/brain-hierarchy';
import { fetchMesh, fetchPointCloud } from '@/components/ThreeDeeBrain/api';
import { CIRCUIT_NOT_BUILT_ERROR } from '@/constants/errors';
import { partialCircuitAtom } from '@/state/brain-model-config/cell-position';
import { cellSvcBaseUrl } from '@/config';

export const meshVisibilityAtom = atomFamily(() => atomWithReset<MeshVisibility[]>([]));

/**
 * Returns an async atom that fetches the mesh of a given brain region
 * @param brainRegionId
 */
export const getMeshAtom = (brainRegionId: string) =>
  atom(async (get) => {
    const session = get(sessionAtom);
    const meshes = await get(meshDistributionsAtom);
    if (!session || !meshes) return undefined;
    const brContentUrl = meshes[brainRegionId].contentUrl;
    return await fetchMesh(session.accessToken, brContentUrl);
  });

export const addMeshVisibilityAtom = atom(
  null,
  (
    get,
    set,
    section: ApplicationSection,
    brainRegionId: string,
    type: VisibilityType,
    sceneId: string
  ) => {
    const visibility = get(meshVisibilityAtom(section));
    set(meshVisibilityAtom(section), [...visibility, { brainRegionId, type, sceneId }]);
  }
);

/**
 * Returns an async atom that fetches the point cloud of a given brain region
 * in a buffer array format
 *
 * @param brainRegionId
 * @param circuitConfigPathOverride
 */
export const getPointCloudAtom = (brainRegionId: string, circuitConfigPathOverride?: string) =>
  atom(async (get) => {
    const partialCircuit = await get(partialCircuitAtom);
    if (!partialCircuit) {
      throw new Error(CIRCUIT_NOT_BUILT_ERROR);
    }
    const partialCircuitConfigPath =
      partialCircuit.circuitConfigPath.url.replace('file://', '') || '';

    const circuitConfigPath =
      typeof circuitConfigPathOverride !== 'undefined'
        ? circuitConfigPathOverride
        : partialCircuitConfigPath;

    const url = `${cellSvcBaseUrl}/circuit?input_path=${encodeURIComponent(
      circuitConfigPath
    )}&region=${brainRegionId.replace(BRAIN_REGION_PREFIX, '')}&how=arrow`;
    return await fetchPointCloud(url);
  });

export const loadingAtom = atom<Record<ApplicationSection, LoadingState[]>>({
  explore: [],
  build: [],
  simulate: [],
});

export const addLoadingAtom = atom(
  null,
  (get, set, section: ApplicationSection, brainRegionId: string, type: VisibilityType) => {
    const loading = get(loadingAtom);
    if (!loading[section].find((l) => l.id === brainRegionId && l.type === type)) {
      set(loadingAtom, {
        ...loading,
        [section]: [...loading[section], { id: brainRegionId, type }],
      });
    }
  }
);

export const disableLoadingAtom = atom(
  null,
  (get, set, section: ApplicationSection, brainRegionId: string, type: VisibilityType) => {
    const loading = get(loadingAtom);
    set(loadingAtom, {
      ...loading,
      [section]: [...loading[section].filter((l) => l.id !== brainRegionId || l.type !== type)],
    });
  }
);
