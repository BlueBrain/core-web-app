import { createHeaders, fetchAtlasAPI } from '@/util/utils';
import {
  BrainRegionWOComposition,
  MeshDistribution,
  MeshDistributionRaw,
  BrainRegionRaw,
} from '@/types/atlas';

const API_BASE = 'https://bluebrainatlas.kcpdev.bbp.epfl.ch/api/ontologies/brain-regions';

const atlasIdUri =
  'https://bbp.epfl.ch/neurosciencegraph/data/4906ab85-694f-469d-962f-c0174e901885';
// the content URL specifies the URL of the distribution to retrieve the brain regions from
// it is added in order to make the request faster
const brainRegionsContentUrl =
  'https://bbp.epfl.ch/nexus/v1/files/neurosciencegraph/datamodels/f4ded89f-67fb-4d34-831a-a3b317c37c1d';

const NEXUS_URL = 'https://bbp.epfl.ch/nexus/v1';

export async function getBrainRegions(accessToken: string) {
  if (!accessToken) throw new Error('Access token should be defined');

  return fetchAtlasAPI(
    'get',
    `${API_BASE}?atlas_id=${atlasIdUri}&content_url=${brainRegionsContentUrl}`,
    accessToken
  )
    .then<BrainRegionRaw[]>((response) => response.json())
    .then<BrainRegionWOComposition[]>((brainRegions) =>
      brainRegions.map(({ color_code: colorCode, id, parentID: parentId, title, leaves }) => ({
        colorCode,
        id,
        // Some Atlas endoints (e.g. the current one) return parentId as a string[] with a single id in it.
        // TODO: to investigate (with later fixing API or updating types)
        parentId: (parentId as unknown as string[])?.[0],
        title,
        leaves,
      }))
    );
}

/**
 * This function returns the promise of fetching the distributions of the brain regions
 * @param accessToken
 */
export async function getDistributions(accessToken: string) {
  if (!accessToken) throw new Error('Access token should be defined');

  return fetchAtlasAPI('get', `${API_BASE}/distributions?atlas_id=${atlasIdUri}`, accessToken)
    .then<Record<string, MeshDistributionRaw>>((response) => response.json())
    .then<MeshDistribution[]>((rawMeshDistributions) =>
      Object.keys(rawMeshDistributions).map((id) => ({
        id,
        name: rawMeshDistributions[id].name,
        contentUrl: rawMeshDistributions[id].content_url,
        encodingFormat: rawMeshDistributions[id].encoding_format,
        contentSize: rawMeshDistributions[id].content_size,
        dataSampleModality: rawMeshDistributions[id].data_sample_modality,
      }))
    );
}

export async function getCompositionData(accessToken: string) {
  if (!accessToken) throw new Error('Access token should be defined');

  const url = `${NEXUS_URL}/files/bbp/atlasdatasetrelease/https%3A%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2F182e8ec7-7b9d-455b-a621-90108623ab76`;
  return fetch(url, {
    method: 'GET',
    headers: createHeaders(accessToken, { Accept: '*/*' }),
  }).then((response) => response.json());
}
