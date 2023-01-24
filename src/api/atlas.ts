import { arrayToTree } from 'performant-array-to-tree';

import { fetchAtlasAPI } from '@/util/utils';
import { BrainRegion, MeshDistribution, MeshDistributionRaw, BrainRegionRaw } from '@/types/atlas';

const API_BASE = 'https://bluebrainatlas.kcpdev.bbp.epfl.ch/api/ontologies/brain-regions';
const CELL_COMPOSITION_ID =
  'https://bbp.epfl.ch/neurosciencegraph/data/cellcompositions/54818e46-cf8c-4bd6-9b68-34dffbc8a68c';

const atlasIdUri =
  'https://bbp.epfl.ch/neurosciencegraph/data/4906ab85-694f-469d-962f-c0174e901885';
// the content URL specifies the URL of the distribution to retrieve the brain regions from
// it is added in order to make the request faster
const brainRegionsContentUrl =
  'https://bbp.epfl.ch/nexus/v1/files/neurosciencegraph/datamodels/f4ded89f-67fb-4d34-831a-a3b317c37c1d';

export async function getBrainRegionsTree(accessToken: string) {
  if (!accessToken) throw new Error('Access token should be defined');

  return fetchAtlasAPI(
    'get',
    `${API_BASE}?atlas_id=${atlasIdUri}&content_url=${brainRegionsContentUrl}`,
    accessToken
  )
    .then<BrainRegionRaw[]>((response) => response.json())
    .then<Omit<BrainRegion, 'composition'>[]>((brainRegions) =>
      brainRegions.map(({ color_code: colorCode, id, parentID: parentId, title }) => ({
        colorCode,
        id,
        parentId,
        title,
      }))
    )
    .then(
      (json) =>
        arrayToTree(json, {
          dataField: null,
          parentId: 'parentId',
          childrenField: 'items',
        }) as BrainRegion[]
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

export async function getBrainRegionById(id: string, accessToken: string) {
  return fetchAtlasAPI(
    'get',
    `${API_BASE}/${id}?atlas_id=${atlasIdUri}&cell_composition_id=${CELL_COMPOSITION_ID}`,
    accessToken
  )
    .then<BrainRegionRaw>((response) => response.json())
    .then<BrainRegion>((brainRegionRaw) => {
      const {
        title,
        color_code: colorCode,
        composition_details: composition,
        distribution,
      } = brainRegionRaw;

      return {
        id,
        title,
        colorCode,
        composition: {
          links: composition.links,
          nodes: composition.nodes.map(
            ({ about, id: brainRegionId, label, neuron_composition, parent_id }) => ({
              about,
              id: brainRegionId,
              label,
              neuronComposition: neuron_composition,
              parentId: parent_id,
            })
          ),
          neuronComposition: composition.neuron_composition,
        },
        distribution: {
          name: distribution.name,
          contentUrl: distribution.content_url,
          encodingFormat: distribution.encoding_format,
          contentSize: distribution.content_size,
          dataSampleModality: distribution.data_sample_modality,
        },
      };
    });
}
