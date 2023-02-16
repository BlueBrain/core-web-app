import _ from 'lodash';
import { composeUrl } from '@/util/nexus';
import { createHeaders } from '@/util/utils';
import { BrainRegion } from '@/types/ontologies';
import { BrainRegionNexus } from '@/api/ontologies/types';

/**
 * Sanitizes the ID in order to be in a single numeric format
 * @param id
 */
export const sanitizeId = (id: string) =>
  id.replace('mba:', '').replace('http://api.brain-map.org/api/v2/data/Structure/', '');

/**
 * Sanitizes the leaves in order to be in a uniform format. Leaves sometimes are
 * in string format, sometimes array of strings, so this function sanitizes them
 * in order to all be in array format
 *
 * @param payload
 */
const sanitizeLeaves = (payload: BrainRegionNexus): string[] => {
  if (_.has(payload, 'hasLeafRegionPart')) {
    if (typeof payload.hasLeafRegionPart === 'string') {
      return [payload.hasLeafRegionPart];
    }
    return payload.hasLeafRegionPart.map((leaf) =>
      leaf.replace('mba:', 'http://api.brain-map.org/api/v2/data/Structure/')
    );
  }
  return payload.hasLeafRegionPart as string[];
};

/**
 * Serializes the brain regions from Nexus format to the local one
 * @param brainRegionPayloads the array of the payloads
 */
const serializeBrainRegions = (
  brainRegionPayloads: (BrainRegionNexus | string)[]
): BrainRegion[] => {
  const serializedBrainRegions: BrainRegion[] = [];
  brainRegionPayloads.forEach((brainRegionPayload) => {
    if (typeof brainRegionPayload !== 'string' && brainRegionPayload.color_hex_triplet) {
      serializedBrainRegions.push({
        id: sanitizeId(brainRegionPayload['@id']),
        colorCode: `#${brainRegionPayload.color_hex_triplet}`,
        parentId: brainRegionPayload.isPartOf ? sanitizeId(brainRegionPayload.isPartOf) : null,
        title: brainRegionPayload.prefLabel,
        leaves: sanitizeLeaves(brainRegionPayload),
      });
    }
  });
  return serializedBrainRegions;
};

/**
 * Retrieves the brain regions from Nexus
 * @param accessToken
 */
const getBrainRegions = async (accessToken: string): Promise<BrainRegion[]> => {
  const url = composeUrl(
    'resource',
    'http://bbp.epfl.ch/neurosciencegraph/ontologies/core/brainregion',
    { org: 'neurosciencegraph', project: 'datamodels' }
  );
  return fetch(url, { headers: createHeaders(accessToken) })
    .then((r) => r.json())
    .then((response) => serializeBrainRegions(response.defines));
};

export default getBrainRegions;
