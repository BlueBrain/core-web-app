import has from 'lodash/has';
import { createHeaders } from '@/util/utils';
import { BrainRegion, BrainRegionOntology, BrainRegionOntologyView } from '@/types/ontologies';
import {
  BrainRegionAnnotationIndex,
  BrainRegionNexus,
  BrainRegionOntologyViewNexus,
  SerializedBrainRegionsAndVolumesResponse,
} from '@/api/ontologies/types';
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

function createAnnotationIndexFromBrainRegions(
  acc: BrainRegionAnnotationIndex,
  cur: { '@id': string; representedInAnnotation: boolean }
) {
  const { representedInAnnotation } = cur;

  return { ...acc, [sanitizeId(cur['@id'])]: { representedInAnnotation } };
}

export function recursivelyCheckLeavesInAnnotation(
  brainRegionAnnotationIndex: BrainRegionAnnotationIndex,
  leaves: string[] | undefined
): boolean {
  return leaves?.length
    ? leaves
        .flatMap((id) => {
          const { leaves: nestedLeaves, representedInAnnotation } =
            brainRegionAnnotationIndex[sanitizeId(id)];

          return nestedLeaves?.length
            ? recursivelyCheckLeavesInAnnotation(brainRegionAnnotationIndex, nestedLeaves)
            : representedInAnnotation;
        })
        .includes(true)
    : false;
}

export function checkLeavesInAnnotation(
  brainRegionAnnotationIndex: BrainRegionAnnotationIndex,
  leaves: string[] | undefined
) {
  return leaves?.length
    ? leaves
        .map((id) => brainRegionAnnotationIndex[sanitizeId(id)]?.representedInAnnotation)
        .includes(true)
    : false;
}

/**
 * Serializes the brain regions from Nexus format to the local one
 * @param brainRegionPayloads the array of the payloads
 */
const serializeBrainRegionsAndVolumes = (
  brainRegionPayloads: (BrainRegionNexus | string)[]
): SerializedBrainRegionsAndVolumesResponse => {
  const serializedBrainRegions: BrainRegion[] = [];
  const volumes: { [key: string]: number } = {};

  const brainRegionAnnotationIndex: BrainRegionAnnotationIndex = (
    brainRegionPayloads as BrainRegionNexus[]
  ).reduce(createAnnotationIndexFromBrainRegions, {});

  brainRegionPayloads.forEach((brainRegionPayload) => {
    const leaves = sanitizeLeaves(brainRegionPayload as BrainRegionNexus);

    const leavesInAnnotation = recursivelyCheckLeavesInAnnotation(
      brainRegionAnnotationIndex,
      leaves
    );

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
        leavesInAnnotation,
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
