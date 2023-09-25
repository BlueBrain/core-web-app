import has from 'lodash/has';
import { createHeaders } from '@/util/utils';
import { BrainRegion, BrainRegionOntology, BrainRegionOntologyView } from '@/types/ontologies';
import {
  ClassNexus,
  BrainRegionOntologyViewNexus,
  SerializedBrainRegionsAndVolumesResponse,
} from '@/api/ontologies/types';
import { composeUrl } from '@/util/nexus';
import { sanitizeId } from '@/util/brain-hierarchy';

/**
 * Sanitizes the leaves in order to be in a uniform format. Leaves sometimes are
 * in string format, sometimes array of strings, so this function sanitizes them
 * in order to all be in array format
 *
 * @param payload
 */
const sanitizeLeaves = (payload: ClassNexus): string[] => {
  if (has(payload, 'hasLeafRegionPart')) {
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
export const serializeBrainRegionsAndVolumes = (
  brainRegionPayloads: (ClassNexus | string)[]
): SerializedBrainRegionsAndVolumesResponse => {
  const serializedBrainRegions: BrainRegion[] = [];
  const volumes: { [key: string]: number } = {};

  brainRegionPayloads.forEach((brainRegionPayload) => {
    const leaves = sanitizeLeaves(brainRegionPayload as ClassNexus);

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
        notation: brainRegionPayload.notation,
        leaves,
        representedInAnnotation: brainRegionPayload.representedInAnnotation,
      });
      if (brainRegionPayload.regionVolume) {
        // retrieving region volume and converting it from cubic micrometer to cubic millimeter
        volumes[brainRegionPayload['@id']] = brainRegionPayload.regionVolume.value * 10 ** -9;
      }
    }
  });

  // removing the duplicate ids
  const ids = serializedBrainRegions.map((br) => br.id);
  return {
    brainRegions: serializedBrainRegions
      .filter(({ id }, index) => !ids.includes(id, index + 1))
      .sort((a, b) => a.title.localeCompare(b.title)),
    volumes,
  };
};

/**
 * Serializes the brain region ontology views.
 *
 * Checks for array because Delta sometimes returns it as object
 * @param nexusViews
 */
export const serializeBrainRegionOntologyViews = (
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
    .then((response) => {
      const brainRegionsResponse = serializeBrainRegionsAndVolumes(response.defines);
      return {
        brainRegions: brainRegionsResponse.brainRegions,
        views:
          'hasHierarchyView' in response
            ? serializeBrainRegionOntologyViews(response.hasHierarchyView)
            : null,
        volumes: brainRegionsResponse.volumes,
      };
    });
};

export default getBrainRegionOntology;
