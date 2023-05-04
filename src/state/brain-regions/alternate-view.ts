import cloneDeep from 'lodash/cloneDeep';
import { arrayToTree } from 'performant-array-to-tree';
import { BrainRegion } from '@/types/ontologies';

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
    .filter((br) => br[parentProperty as keyof BrainRegion] !== null);
  cleanBrainRegions.forEach((br) => {
    br.view = newViewId; // eslint-disable-line no-param-reassign
  });

  return arrayToTree(cleanBrainRegions, {
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
    brainRegionRoot.items = alternateChildren; // eslint-disable-line no-param-reassign
    brainRegionRoot.view = newViewId; // eslint-disable-line no-param-reassign
  } else {
    brainRegionRoot.items?.forEach((br) => {
      // iterate over each child
      buildAlternateTree(br, alternatedRegionId, alternateChildren, newViewId);
    });
  }
};

/* eslint-enable no-param-reassign */
