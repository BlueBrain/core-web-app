import { atomFamily, selectAtom } from 'jotai/utils';
import { findDeep, reduceDeep } from 'deepdash-es/standalone';
import { brainRegionsFilteredTreeAtom } from '@/state/brain-regions/index';
import { BrainRegion } from '@/types/ontologies';

/**
 * Returns the descendants of a provided brain region along with the requested brain region
 */
export const brainRegionDescendantsAtom = atomFamily((brainRegionId?: string) =>
  selectAtom<Promise<BrainRegion[] | null>, Promise<BrainRegion[] | undefined>>(
    brainRegionsFilteredTreeAtom,
    async (brainRegionTree) => {
      if (!brainRegionId || !brainRegionTree) return undefined;
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
      return [...descendants, brainRegion];
    }
  )
);
