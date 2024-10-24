import has from 'lodash/has';
import { BrainRegion, BrainRegionOntology, BrainRegionOntologyView } from '@/types/ontologies';
import {
  ClassNexus,
  BrainRegionOntologyViewNexus,
  SerializedBrainRegionsAndVolumesResponse,
} from '@/api/ontologies/types';
import { composeUrl } from '@/util/nexus';
import { brainRegionOntologyResource } from '@/config';
import { Distribution } from '@/types/nexus';
import authFetch from '@/authFetch';

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
    return payload.hasLeafRegionPart;
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
        id: brainRegionPayload['@id'],
        colorCode: `#${
          brainRegionPayload.color_hex_triplet ? brainRegionPayload.color_hex_triplet : 'FFF'
        }`,
        isPartOf: brainRegionPayload.isPartOf ? brainRegionPayload.isPartOf[0] : null,
        isLayerPartOf: brainRegionPayload.isLayerPartOf
          ? brainRegionPayload.isLayerPartOf[0]
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
const getBrainRegionOntology = async (): Promise<BrainRegionOntology> => {
  const { id, org, project, tag } = brainRegionOntologyResource;

  const url = composeUrl('resource', id, { org, project, source: true, tag });
  return authFetch(url, { headers: { 'Content-Type': 'application/json', Accept: '*/*' } })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Brain region ontology could not be retrieved');
      }
      return response.json();
    })
    .then((resource) => {
      const distribution = resource.distribution.find(
        (dist: Distribution) => dist.encodingFormat === 'application/ld+json'
      );
      if (!distribution) {
        throw new Error('Distribution not found in brain region ontology');
      }

      return authFetch(distribution.contentUrl, {
        headers: { 'Content-Type': 'application/json', Accept: '*/*' },
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Brain region ontology file could not be retrieved');
      }
      return response.json();
    })
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
