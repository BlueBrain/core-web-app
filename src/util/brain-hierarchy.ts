import { TreeItem } from 'performant-array-to-tree';
import { Composition, CompositionOverrideLeafNode } from '@/types/composition';

const BRAIN_REGION_URI_BASE = 'http://api.brain-map.org/api/v2/data/Structure';

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
    node.density = node.composition.neuron.density;
  }

  return node;
}

/**
 * Extend a composition with a density property on each (etype) leaf.
 */
export function extendCompositionWithOverrideProps(composition: Composition): Composition {
  Object.values(composition.hasPart).forEach((node) => extendLeafNodeWithOverrideProps(node));

  return composition;
}

/**
 * Converts numeric brain region id to URI:
 * XXX -> http://api.brain-map.org/api/v2/data/Structure/XXX
 */
export function brainRegionIdToUri(brainRegionId: string) {
  return `${BRAIN_REGION_URI_BASE}/${brainRegionId}`;
}

/**
 * Extracts numeric brain region id from URI:
 * http://api.brain-map.org/api/v2/data/Structure/XXX -> XXX
 */
export function brainRegionIdFromUri(brainRegionUri: string) {
  return brainRegionUri.match(/.*\/(\d+)$/)?.[1];
}
