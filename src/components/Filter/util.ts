import omit from 'lodash/omit';
import isNumber from 'lodash/isNumber';
import { Filter } from './types';
import { BrainRegion } from '@/types/ontologies';
import { FilterTypeEnum } from '@/types/explore-section/filters';

/**
 * Takes array of brainRegions and searches for targetTitle against BrainRegion.title
 * If found all the parent BrainRegions are collected without their items and returned
 * @param {import("./types/ontologies").BrainRegion[]} nodes
 * @param {string} targetTitle
 * @param collectedBrainRegions
 */
export function findTitleAndCollectParentBrainRegions(
  nodes: BrainRegion[] | null,
  targetTitle: string,
  collectedBrainRegions: BrainRegion[] = []
): BrainRegion[] | null {
  let foundBrainRegions: BrainRegion[] | null = null;

  if (!nodes) return foundBrainRegions;

  nodes.forEach((node) => {
    if (node.title === targetTitle) {
      collectedBrainRegions.push(omit(node, 'items'));
      foundBrainRegions = collectedBrainRegions.slice().reverse().slice(1);
      return;
    }

    if (node.items && node.items.length > 0) {
      collectedBrainRegions.push(omit(node, 'items'));
      if (!foundBrainRegions) {
        foundBrainRegions = findTitleAndCollectParentBrainRegions(
          node.items,
          targetTitle,
          collectedBrainRegions
        );
      }

      if (foundBrainRegions) {
        return;
      }

      collectedBrainRegions.pop();
    }
  });

  return foundBrainRegions;
}

/**
 * Checks whether the filter has a value assigned
 *
 * @param filter the filter to check
 */
export function filterHasValue(filter: Filter) {
  switch (filter.type) {
    case FilterTypeEnum.CheckList:
      return filter.value.length !== 0;
    case FilterTypeEnum.DateRange:
      return filter.value.gte || filter.value.lte;
    case FilterTypeEnum.ValueRange:
      return filter.value.gte || filter.value.lte;
    case FilterTypeEnum.ValueOrRange:
      if (!filter.value) {
        return false;
      }
      return !!(isNumber(filter.value) || filter.value.gte || filter.value.lte);
    default:
      return !!filter.value;
  }
}
