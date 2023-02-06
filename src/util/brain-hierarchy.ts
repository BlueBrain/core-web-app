import { TreeItem } from 'performant-array-to-tree';
import { Composition, Node } from '@/types/atlas';
import { BrainRegionURI, CompositionOverridesWorkflowConfig } from '@/types/nexus';

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

/**
 * Created a composition configuration to be consumed by the workflow
 */
export function createCompositionOverridesWorkflowConfig(
  brainRegionURI: BrainRegionURI,
  composition: Composition
): CompositionOverridesWorkflowConfig {
  const mtypeNodeIndex: Record<string, Node> = composition.nodes
    .filter((node) => node.about === 'MType')
    .reduce((indexMap, node) => ({ ...indexMap, [node.id]: node }), {});

  const compositionOverrides = composition.nodes
    .filter((node) => node.about === 'EType')
    .reduce<CompositionOverridesWorkflowConfig>((config, etypeNode) => {
      const mtypeNodeId = etypeNode.parentId as string;

      const mtypeNode = mtypeNodeIndex[mtypeNodeId];

      return {
        [brainRegionURI]: {
          label: '',
          hasPart: {
            ...config?.[brainRegionURI]?.hasPart,
            [mtypeNode.id]: {
              ...config[mtypeNode.id],
              label: mtypeNode.label,
              about: mtypeNode.about,
              hasPart: {
                [etypeNode.id]: {
                  label: etypeNode.label,
                  about: etypeNode.about,
                  density: etypeNode.neuronComposition.density,
                  count: etypeNode.neuronComposition.count,
                },
              },
            },
          },
        },
      };
    }, {});

  return compositionOverrides;
}

/**
 * Apply densities from the workflow config to the existing composition in place
 */
export function applyCompositionOverrides(
  brainRegionURI: BrainRegionURI,
  composition: Composition,
  workflowConfig: CompositionOverridesWorkflowConfig
) {
  if (!workflowConfig) return composition;

  // Index composition nodes by id for fast access
  const nodeIndex: Record<string, Node> = composition.nodes.reduce(
    (indexMap, node) => ({ ...indexMap, [node.id]: node }),
    {}
  );

  Object.entries(workflowConfig?.[brainRegionURI]?.hasPart ?? {}).forEach(
    ([mtypeId, mtypeEntry]) => {
      // Compute and apply densities and counts for mtypes
      const mtypeDensity = Object.values(mtypeEntry.hasPart)
        .map((etypeEntry) => etypeEntry.density)
        .reduce((totalDensity, density) => totalDensity + density, 0);

      const mtypeCount = Object.values(mtypeEntry.hasPart)
        .map((etypeEntry) => etypeEntry.count)
        .reduce((totalCount, count) => totalCount + count, 0);

      nodeIndex[mtypeId].neuronComposition = {
        density: mtypeDensity,
        count: mtypeCount,
      };

      // Apply densities and counts for etypes
      Object.entries(mtypeEntry.hasPart).forEach(([etypeId, etypeEntry]) => {
        const { density, count } = etypeEntry;

        nodeIndex[etypeId].neuronComposition = { density, count };
      });
    }
  );

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
