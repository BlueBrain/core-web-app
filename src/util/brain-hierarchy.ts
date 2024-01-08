import { TreeItem } from 'performant-array-to-tree';
import { OriginalComposition, CompositionOverrideLeafNode } from '@/types/composition/original';
import { Ancestor, BrainRegion, DefaultBrainViewId } from '@/types/ontologies';
import { BRAIN_VIEW_LAYER } from '@/constants/brain-hierarchy';

export const BRAIN_REGION_URI_BASE = 'http://api.brain-map.org/api/v2/data/Structure';

export type RegionFullPathType = {
  id: string;
  name: string;
};

// This function's purpose is similar to that of itemsInAnnotationReducer(), in that it looks for the descendents of a brain region to recursively check whether at least one of the descendents is represented in the annotation volume.
// The difference is that this function relies on a flat brainRegions array, whereas itemsInAnnotationReducer() is used to handle the nested tree hierarchy structure.
export function checkRepresentationOfDescendents(
  acc: { brainRegions: BrainRegion[]; representedInAnnotation: boolean },
  brainRegionId: string
): { brainRegions: BrainRegion[]; representedInAnnotation: boolean } {
  const { brainRegions, representedInAnnotation } = acc;

  if (representedInAnnotation) {
    return {
      brainRegions,
      representedInAnnotation,
    }; // It only needs to be true for one.
  }

  const brainRegion = brainRegions?.find(({ id }) => id === brainRegionId);

  const descendents = getDescendentsFromView(
    brainRegion?.hasPart,
    brainRegion?.hasLayerPart,
    brainRegion?.view
  );

  const { representedInAnnotation: descendentsRepresentedInAnnotation } = descendents?.reduce(
    checkRepresentationOfDescendents,
    {
      brainRegions,
      representedInAnnotation: false,
    }
  ) ?? { representedInAnnotation: false }; // If no descendents, then no descendents are represented.

  return {
    brainRegions,
    representedInAnnotation:
      brainRegion?.representedInAnnotation ?? descendentsRepresentedInAnnotation,
  };
}

// This function returns either the hasPart or hasLayerPart array of brain region IDs, depending on the currently selected "view" (think: default or layer-based).
export function getDescendentsFromView(
  hasPart?: string[],
  hasLayerPart?: string[],
  view?: string
): string[] | undefined {
  let descendents;

  // Currently, it seems that "layer" brain regions have the default view ID, even if they will never appear in the default hierarchy.
  switch (view) {
    case BRAIN_VIEW_LAYER:
      descendents = hasLayerPart;
      break;
    default: // This means that by default, layer-based views also have the default view ID (see brainRegionOntologyAtom).
      descendents = hasPart ?? hasLayerPart; // To compensate for this, we first check whether hasPart, before falling-back on hasLayerPart (for the layer-based brain-regions).
  }

  return descendents;
}

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
  ancestors: Ancestor[]
) => {
  brainRegion.items?.forEach((br) => {
    const newRegion = { ...br };

    delete newRegion.items;

    const view = brainRegion?.view;
    const ancestor = view
      ? { [brainRegion.id]: view }
      : { [brainRegion.id]: 'https://neuroshapes.org/BrainRegion' as DefaultBrainViewId }; // Use default if view undefined.
    const newAncestors = ancestor ? [...ancestors, ancestor] : ancestors;

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
