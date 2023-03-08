import _ from 'lodash';
import { Composition, CompositionPair, LeafNode, CompositionNode } from '@/types/composition';
import {
  AnalysedComposition,
  CalculationLink,
  CalculationNode,
  CompositionLink,
} from '@/util/composition/types';

/* eslint-disable no-param-reassign */

const initializeComposition = (): CompositionPair => ({
  neuron: { count: 0, density: 0 },
  glia: { count: 0, density: 0 },
});

/**
 * Re-calculate the composition between two composition pairs
 * @param totalComposition
 * @param toAdd
 */
export function addCompositions(totalComposition: CompositionPair, toAdd: CompositionPair) {
  const keyToAdd = 'neuron' in toAdd ? 'neuron' : 'glia';
  totalComposition[keyToAdd].count += toAdd[keyToAdd].count;
  totalComposition[keyToAdd].density += toAdd[keyToAdd].density;
}

/**
 * Add the node to the map of nodes, if it does not already exist. If it exists,
 * update the leaves and re-calculate the composition
 * @param node
 * @param nodes
 */
export function addNode(node: CalculationNode, nodes: { [key: string]: CalculationNode }) {
  const id = `${node.id}__${node.parentId}`;
  if (id in nodes) {
    addCompositions(nodes[id].composition, node.composition);
    // @ts-ignore
    nodes[id].leaves = new Set([...nodes[id].leaves, ...node.leaves]);
    // @ts-ignore
    nodes[id].relatedNodes = new Set([...nodes[id].relatedNodes, ...node.relatedNodes]);
  } else {
    nodes[id] = node;
  }
}

/**
 * Receives a node of the tree and returns back the composition of itself by
 * recursively iterating over itself until it reaches the bottom of the tree
 *
 * @param subTree the node
 * @param subTreeId the id of the node
 * @param nodes the map of total nodes
 * @param links the map of total links
 * @param leafId the leaf id we currently iterate into
 */
export function iterateNode(
  subTree: LeafNode,
  subTreeId: string,
  nodes: { [key: string]: CalculationNode },
  links: { [key: string]: CalculationLink },
  leafId: string
): CompositionPair {
  if ('hasPart' in subTree) {
    const totalComposition = initializeComposition();
    // for each child of the node
    Object.entries(subTree.hasPart).forEach(([childId, childSubtree]) => {
      // calculate its composition and add it in the total
      const childComposition = iterateNode(childSubtree, childId, nodes, links, leafId);
      addCompositions(totalComposition, childComposition);
      const parentId = subTree.about !== 'BrainRegion' ? subTreeId : null;
      const node = {
        about: childSubtree.about,
        composition: childComposition,
        id: childId,
        label: childSubtree.label,
        parentId,
        leaves: new Set([leafId]),
        relatedNodes: new Set(Object.keys(subTree.hasPart)),
      };
      // add the node in the set of nodes
      addNode(node, nodes);
      if (subTree.about !== 'BrainRegion') {
        links[`${subTreeId}__${childId}`] = {
          source: subTreeId,
          target: childId,
        };
      }
    });

    subTree.composition = totalComposition;
    return totalComposition;
  }
  // @ts-ignore
  return _.cloneDeep(subTree.composition);
}

/**
 * Given the composition file and the leaf IDs, calculates the nodes/links arrays
 * used in order to build the MType/EType tree and the sankey diagram
 *
 * @param compositionFile the composition file in its original format
 * @param leafIDs the IDs of the leaves
 */
export default async function calculateCompositions(
  compositionFile: Composition,
  leafIDs: string[] | undefined
): Promise<AnalysedComposition> {
  const nodes: { [key: string]: CalculationNode } = {};
  const links: { [key: string]: CalculationLink } = {};
  const totalComposition = initializeComposition();
  const volumes: { [key: string]: number } = {};
  leafIDs?.forEach((leafId) => {
    if (leafId in compositionFile.hasPart) {
      const leaf = compositionFile.hasPart[leafId];
      const leafComposition = iterateNode(leaf, leafId, nodes, links, leafId);
      volumes[leafId] = leafComposition.neuron.count / leafComposition.neuron.density;
      addCompositions(totalComposition, leaf.composition);
    }
  });

  const nodesArray: CompositionNode[] = [];
  Object.entries(nodes).forEach(([nodeId, node]) => {
    nodesArray.push({
      about: node.about,
      id: nodeId.split('__')[0],
      label: node.label,
      parentId: node.parentId,
      neuronComposition: node.composition.neuron,
      leaves: Array.from(node.leaves),
      relatedNodes: Array.from(node.relatedNodes),
    });
  });

  const linksArray: CompositionLink[] = [];
  Object.values(links).forEach((link) => {
    linksArray.push({
      source: link.source,
      target: link.target,
    });
  });

  return {
    nodes: nodesArray,
    links: linksArray,
    totalComposition,
    composition: compositionFile,
    volumes,
  };
}
/* eslint-enable no-param-reassign */
