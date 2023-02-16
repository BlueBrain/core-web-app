import { composeUrl } from '@/util/nexus';
import { createHeaders } from '@/util/utils';
import { sanitizeId } from '@/api/ontologies/brain-regions';
import { MeshSourceNexus } from '@/api/ontologies/types';
import { Mesh } from '@/types/ontologies';
import { getAtlasReleaseMeshesQuery } from '@/queries/es';

/**
 * Serialize the meshes in an object format of ID => Mesh where id is the id
 * of the brain region where it belongs
 * @param meshPayloads
 */
const serializeMeshes = (meshPayloads: MeshSourceNexus[]): { [id: string]: Mesh } => {
  const meshDistributions: { [id: string]: Mesh } = {};
  const serializedMeshDistributions = meshPayloads.map((meshPayload) => ({
    contentUrl: meshPayload._source.distribution.contentUrl,
    brainRegion: sanitizeId(meshPayload._source.brainLocation.brainRegion['@id']),
  }));
  serializedMeshDistributions.forEach((meshDistribution) => {
    meshDistributions[meshDistribution.brainRegion] = meshDistribution;
  });
  return meshDistributions;
};

const getDistributions = async (accessToken: string): Promise<{ [id: string]: Mesh }> => {
  const url = composeUrl(
    'view',
    'https://bbp.epfl.ch/neurosciencegraph/data/420e53b8-db21-4f70-a534-d799c4b59b5d',
    {
      org: 'bbp',
      project: 'atlas',
      viewType: 'es',
    }
  );
  return fetch(url, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(getAtlasReleaseMeshesQuery()),
  })
    .then((r) => r.json())
    .then((response) => serializeMeshes(response.hits.hits));
};

export default getDistributions;
