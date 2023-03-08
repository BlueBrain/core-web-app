import _ from 'lodash';
import { createHeaders } from '@/util/utils';
import { BrainRegion, BrainRegionOntology, BrainRegionOntologyView } from '@/types/ontologies';
import { BrainRegionNexus, BrainRegionOntologyViewNexus } from '@/api/ontologies/types';
import { composeUrl } from '@/util/nexus';

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
    if (typeof brainRegionPayload !== 'string' && brainRegionPayload.prefLabel) {
      serializedBrainRegions.push({
        id: sanitizeId(brainRegionPayload['@id']),
        colorCode: `#${
          brainRegionPayload.color_hex_triplet ? brainRegionPayload.color_hex_triplet : 'FFF'
        }`,
        isPartOf: brainRegionPayload.isPartOf ? sanitizeId(brainRegionPayload.isPartOf[0]) : null,
        isLayerPartOf: brainRegionPayload.isLayerPartOf
          ? sanitizeId(brainRegionPayload.isLayerPartOf[0])
          : null,
        hasLayerPart: brainRegionPayload.hasLayerPart,
        hasPart: brainRegionPayload.hasPart,
        title: brainRegionPayload.prefLabel,
        leaves: sanitizeLeaves(brainRegionPayload),
      });
    }
  });
  // removing the duplicate ids
  const ids = serializedBrainRegions.map((br) => br.id);
  return serializedBrainRegions
    .filter(({ id }, index) => !ids.includes(id, index + 1))
    .sort((a, b) => a.title.localeCompare(b.title));
};

/**
 * Serializes the brain region ontology views.
 *
 * Checks for array because Delta sometimes returns it as object
 * @param nexusViews
 */
const serializeBrainRegionOntologyViews = (
  nexusViews: BrainRegionOntologyViewNexus[]
): BrainRegionOntologyView[] =>
  nexusViews.map((nexusView) => ({
    id: nexusView['@id'],
    leafProperty: nexusView.hasLeafHierarchyProperty,
    parentProperty: nexusView.hasParentHierarchyProperty,
    childrenProperty: nexusView.hasChildrenHierarchyProperty,
    title: nexusView.label,
  }));

/**
 * Retrieves the brain regions from Nexus
 * @param accessToken
 */
const getBrainRegionOntology = async (accessToken: string): Promise<BrainRegionOntology> => {
  const url = composeUrl(
    'resource',
    'http://bbp.epfl.ch/neurosciencegraph/ontologies/core/brainregion',
    { org: 'neurosciencegraph', project: 'datamodels', source: true }
  );
  return fetch(url, { headers: createHeaders(accessToken) })
    .then((r) => r.json())
    .then((response) => ({
      brainRegions: serializeBrainRegions(response.defines),
      views:
        'hasHierarchyView' in response
          ? serializeBrainRegionOntologyViews(response.hasHierarchyView)
          : null,
    }));
};

export default getBrainRegionOntology;
