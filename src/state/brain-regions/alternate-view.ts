import cloneDeep from 'lodash/cloneDeep';
import { arrayToTree } from 'performant-array-to-tree';
import { BrainRegion } from '@/types/ontologies';
import { sanitizeId } from '@/api/ontologies/brain-regions';

type BrainRegionAnnotationIndex = {
  [key: string]: {
    items?: BrainRegion[];
    leaves: string[] | undefined;
    representedInAnnotation: boolean;
  };
};

function createAnnotationIndexFromBrainRegions(
  acc: BrainRegionAnnotationIndex,
  cur: { hasLayerPart?: string[]; id: string; representedInAnnotation: boolean }
) {
  const { hasLayerPart: leaves, representedInAnnotation } = cur;

  return { ...acc, [cur.id]: { leaves, representedInAnnotation } };
}

function recursivelyCheckLeavesInAnnotation(
  brainRegionAnnotationIndex: BrainRegionAnnotationIndex,
  leaves: string[] | undefined,
  representedInAnnotation: boolean
): boolean {
  return leaves?.length
    ? leaves
        .flatMap((id) => {
          const { leaves: nestedLeaves, representedInAnnotation: nestedRepresentedInAnnotation } =
            brainRegionAnnotationIndex[sanitizeId(id)];

          return nestedLeaves?.length
            ? recursivelyCheckLeavesInAnnotation(
                brainRegionAnnotationIndex,
                nestedLeaves,
                nestedRepresentedInAnnotation
              )
            : nestedRepresentedInAnnotation;
        })
        .includes(true)
    : representedInAnnotation;
}

/* eslint-disable no-param-reassign */

/**
 * Builds the alternate children of a given selected view
 * @param brainRegionId
 * @param parentProperty
 * @param brainRegions
 * @param newViewId
 */
export const buildAlternateChildren = (
  brainRegionId: string,
  parentProperty: string,
  brainRegions: BrainRegion[],
  newViewId: string
) => {
  let cleanBrainRegions = cloneDeep(brainRegions);

  cleanBrainRegions = cleanBrainRegions
    .filter((br) => br.id !== brainRegionId)
    // @ts-ignore
    .filter((br) => br[parentProperty] !== null);
  cleanBrainRegions.forEach((br) => {
    br.view = newViewId;
  });

  const brainRegionAnnotationIndex = brainRegions.reduce(createAnnotationIndexFromBrainRegions, {});

  const updatedBrainRegions = cleanBrainRegions.map(
    ({ hasLayerPart: leaves, representedInAnnotation, ...rest }) => {
      const leavesInAnnotation = recursivelyCheckLeavesInAnnotation(
        brainRegionAnnotationIndex,
        leaves,
        representedInAnnotation
      );

      return { ...rest, leaves, leavesInAnnotation, representedInAnnotation };
    }
  );

  return arrayToTree(updatedBrainRegions, {
    dataField: null,
    parentId: parentProperty,
    childrenField: 'items',
    rootParentIds: { [brainRegionId]: true },
  }) as BrainRegion[];
};

/**
 * Builds the alternate tree based on a set of children
 * @param brainRegionRoot the currently visited root
 * @param alternatedRegionId the id of the region we alternate
 * @param alternateChildren the array of children we alternate
 * @param newViewId
 */
export const buildAlternateTree = (
  brainRegionRoot: BrainRegion,
  alternatedRegionId: string,
  alternateChildren: BrainRegion[],
  newViewId: string
) => {
  // if the currently visited region is the one whose children we want to replace
  if (brainRegionRoot.id === alternatedRegionId) {
    brainRegionRoot.items = alternateChildren;
    brainRegionRoot.view = newViewId;
  } else {
    brainRegionRoot.items?.forEach((br) => {
      // iterate over each child
      buildAlternateTree(br, alternatedRegionId, alternateChildren, newViewId);
    });
  }
};

/* eslint-enable no-param-reassign */
