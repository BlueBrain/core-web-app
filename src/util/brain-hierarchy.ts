import { TreeItem } from 'performant-array-to-tree';
import { OriginalComposition, CompositionOverrideLeafNode } from '@/types/composition/original';
import { BrainRegion } from '@/types/ontologies';

export const BRAIN_REGION_URI_BASE = 'http://api.brain-map.org/api/v2/data/Structure';

export type RegionFullPathType = {
  id: string;
  name: string;
};

/* eslint-disable consistent-return */
/**
 * Gets the path from top brain region to node clicked.
 *
 * @param {string} hierarchy - The whole tree hierarchy.
 * @param {string} nodeId - The id clicked.
 *
 * @returns {RegionFullPathType[]} path - List of path.
 */
export function getBottomUpPath(hierarchy: TreeItem[], nodeId: string): RegionFullPathType[] {
  // credit https://gist.github.com/sachinpatel88/649f7643010dd9707a2b840a824dc06d
  function getPaths(nestedObj: TreeItem[], isObjectSelectedCB: any) {
    if (!nestedObj) return;

    const paths: RegionFullPathType[][] = [];
    const parentPath: RegionFullPathType[] = [];

    return (function deepCheck(items) {
      if (!items) return;

      if (!Array.isArray(items)) return paths;

      items.forEach((item) => {
        parentPath.push({ id: item.id, name: item.title });
        if (isObjectSelectedCB(item)) {
          paths.push([...parentPath]);
        }

        const childrenItems = item.items;
        if (childrenItems) {
          deepCheck(childrenItems);
        }
        parentPath.pop();
      });

      return paths;
    })(nestedObj);
  }

  const idMatches = ({ id }: { id: string }) => id === nodeId;
  const paths = getPaths(hierarchy, idMatches);

  if (!paths?.length) return [];
  return paths[0];
}
/* eslint-enable consistent-return */

export function extendLeafNodeWithOverrideProps(
  node: CompositionOverrideLeafNode
): CompositionOverrideLeafNode {
  if (node.hasPart) {
    Object.values(node.hasPart).forEach((childNode) => extendLeafNodeWithOverrideProps(childNode));
  } else {
    // eslint-disable-next-line no-param-reassign
    node.density = node.composition.neuron?.density;
  }

  return node;
}

/**
 * Extend a composition with a density property on each (etype) leaf.
 */
export function extendCompositionWithOverrideProps(
  composition: OriginalComposition
): OriginalComposition {
  Object.values(composition.hasPart).forEach((node) => extendLeafNodeWithOverrideProps(node));

  return composition;
}

/**
 * Adds the itemsInAnnotation property to every brain region in a tree.
 * @param {BrainRegion[]} accBrainRegions
 * @param {BrainRegion} curBrainRegion
 */
export function itemsInAnnotationReducer(
  accBrainRegions: BrainRegion[],
  curBrainRegion: BrainRegion
): BrainRegion[] {
  const { items } = curBrainRegion;
  // NOT a leaf
  if (items && items?.length !== 0) {
    const reducedItems = items.reduce(itemsInAnnotationReducer, []); // First add itemsInAnnotation to any descendents.

    const itemsInAnnotation: boolean = reducedItems
      .flatMap(
        ({
          items: nestedItems,
          itemsInAnnotation: nestedItemsInAnnotation,
          representedInAnnotation: nestedRepresentedInAnnotation,
        }) =>
          nestedItems?.length !== 0 && nestedItemsInAnnotation
            ? nestedItemsInAnnotation
            : nestedRepresentedInAnnotation
      )
      .includes(true); // Is it true for at least one of the descendents?

    return [...accBrainRegions, { ...curBrainRegion, items: reducedItems, itemsInAnnotation }];
  }

  // LEAF
  return [...accBrainRegions, { ...curBrainRegion, itemsInAnnotation: false }]; // No items? Then no items in annotation.
}

/**
 * Recursively unravels a brain region tree to an array
 * @param brainRegion
 * @param result
 * @param ancestors
 */
export const treeToArray = (
  brainRegion: BrainRegion,
  result: BrainRegion[],
  ancestors: string[]
) => {
  brainRegion.items?.forEach((br) => {
    const newRegion = { ...br };
    delete newRegion.items;
    const newAncestors = [...ancestors, brainRegion.id];
    newRegion.ancestors = newAncestors;
    result.push(newRegion);
    treeToArray(br, result, newAncestors);
  });
};

export function flattenBrainRegionsTree(tree: BrainRegion[] | null): BrainRegion[] | null {
  // if the tree is successfully created, make region 8 the root and flatten it
  // back to array. This is done in order to remove the brain regions that are
  // siblings or parents of region 8
  if (tree) {
    const root = { ...tree[0] };

    if (root) {
      const flattenedRegions: BrainRegion[] = [];

      treeToArray(root, flattenedRegions, []);

      delete root.items;

      return flattenedRegions;
    }
  }

  return tree;
}

/**
 * get all deeply nested ancestors of a brain region
 * @param vertex brain region
 * @param all accumalutor
 * @returns all deeply nested ancestors
 */
// eslint-disable-next-line consistent-return
export function getDeeplyNestedChildrenFromNode(vertex: TreeItem, all: string[]) {
  if (vertex && vertex.items) {
    // eslint-disable-next-line no-restricted-syntax
    for (const node of vertex.items) {
      all.push(node.id);
      if (node.items && node.items.length) {
        getDeeplyNestedChildrenFromNode(node, all);
      }
    }
  }
  return all;
}
