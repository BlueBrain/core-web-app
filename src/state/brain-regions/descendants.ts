import { findDeep, reduceDeep } from 'deepdash-es/standalone';
import { atom } from 'jotai';
import uniqBy from 'lodash/uniqBy';
import { brainRegionsFilteredTreeAtom } from '@/state/brain-regions/index';
import { BrainRegion } from '@/types/ontologies';

/**
 * Returns the descendants of a list of brain regions based on their id
 */
export const getBrainRegionDescendants = (brainRegionIds: string[]) =>
  atom(async (get) => {
    const brainRegionTree = await get(brainRegionsFilteredTreeAtom);
    if (!brainRegionTree) return undefined;
    // returns unique brain regions (in case there is an overlap of brain regions)
    return uniqBy(
      brainRegionIds.reduce((totalDescendants: BrainRegion[], brainRegionId: string) => {
        // first search for the actual brain region in the tree
        const brainRegion = findDeep(brainRegionTree, (region) => region.id === brainRegionId, {
          pathFormat: 'array',
          childrenPath: ['items'],
        })?.value;
        // if not found, return empty array
        if (!brainRegion) return [];
        // iterate over the children of the brain region (items) and construct array of descendants
        const descendants = reduceDeep(
          brainRegion,
          (acc, value: BrainRegion) => {
            if (value.items) {
              return [...acc, ...value.items];
            }
            return acc;
          },
          [],
          { pathFormat: 'array', childrenPath: ['items'] }
        );
        // appends the brain region along with the descendants
        return [...totalDescendants, ...descendants, brainRegion];
      }, []),
      'id'
    );
  });
