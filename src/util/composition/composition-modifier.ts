import _ from 'lodash';
import { Composition, CompositionNode, CompositionUnit, LeafNode } from '@/types/composition';
import { calculateNewExtendedNodeId, childIsLocked } from '@/util/composition/utils';

/* eslint-disable no-param-reassign */

/**
 * Calculates the value spread of the children of a node
 *
 * @param node the parentNode
 * @param extendedNodeId
 * @param modifiedNode the node that was modified
 * @param lockedIds the array of IDs that are locked
 */
export const calculateRatioSpread = (
  node: LeafNode,
  extendedNodeId: string,
  modifiedNode: CompositionNode,
  lockedIds: string[]
): { [key: string]: number } => {
  // if the modifiedNodeId is part of the children then the value
  // is spread between the siblings of the node
  const valueSpread: { [key: string]: number } = {};
  let siblingsSum = 0;
  let modifiedSiblingsAmount = 0;
  Object.entries(node.hasPart).forEach(([childId, child]) => {
    // if the child is a sibling of the one that is modified and its not locked
    // then we count them as part of the total sum
    if (childId !== modifiedNode.id && !childIsLocked(lockedIds, extendedNodeId, childId)) {
      modifiedSiblingsAmount += 1;
      siblingsSum += child.composition.neuron.count;
    }
  });
  siblingsSum = Math.round(siblingsSum * 100) / 100;
  Object.entries(node.hasPart).forEach(([childId, child]) => {
    // if the child is the one that is modified, the value will be the whole change
    if (childId === modifiedNode.id) {
      valueSpread[childId] = 1;
    }
    // Specific case where all siblings that will spread the value sum to almost 0
    else if (siblingsSum < 0.1) {
      valueSpread[childId] = 1 / modifiedSiblingsAmount;
    } else if (
      childIsLocked(lockedIds, extendedNodeId, childId) ||
      child.composition.neuron.count < 2
    ) {
      valueSpread[childId] = 0;
    } else if (!childIsLocked(lockedIds, extendedNodeId, childId)) {
      // if its a sibling then the spread is the value/sum
      valueSpread[childId] = child.composition.neuron.count / siblingsSum;
    }
  });
  return valueSpread;
};

/**
 * Adds the composition to a node. The added value can be either positive or negative (decrease)
 *
 * @param node the node to apply the addition
 * @param densityOrCount "density" or "count"
 * @param valueToAdd the value to modify
 */
export const addComposition = (node: LeafNode, densityOrCount: string, valueToAdd: number) => {
  // name of the other field from the one selected
  let previousValue = node.composition.neuron[densityOrCount as keyof CompositionUnit];
  // hack to avoid division by 0 when a value goes to 0
  // This issue will probably be avoided in the next implementation based
  // on multiplication instead of addition
  if (previousValue === 0) {
    previousValue = 0.1;
  }
  const otherField = densityOrCount === 'count' ? 'density' : 'count';
  const changePercentage = valueToAdd / previousValue;
  // case to avoid negative values
  node.composition.neuron[densityOrCount as keyof CompositionUnit] = Math.max(
    node.composition.neuron[densityOrCount as keyof CompositionUnit] + valueToAdd,
    0
  );
  const densityModifiedValue = node.composition.neuron[otherField] * changePercentage;
  node.composition.neuron[otherField] = Math.max(
    (node.composition.neuron[otherField] += densityModifiedValue),
    0
  );
  // the count should be rounded
  node.composition.neuron.count = Math.round(node.composition.neuron.count);
  return node;
};

/**
 * Iterates recursively the tree of a leaf in order to reach the bottom and modify
 * the values. In the process, it splits the changed value when needed.
 *
 * @param node the currently visited node
 * @param nodeId the currently visited node id
 * @param extendedNodeId the currently visited node id with ancestor history
 * @param modifiedNode the node that is modified
 * @param isAffected whether the node is affected or not
 * @param modifiedValue the change of value
 * @param lockedIds the array of IDs that are locked
 * @param densityOrCount whether density or count is currently selected
 */
export const iterateLeafTree = (
  node: LeafNode,
  nodeId: string,
  extendedNodeId: string,
  modifiedNode: CompositionNode,
  isAffected: Boolean,
  modifiedValue: number,
  lockedIds: string[],
  densityOrCount: string
) => {
  // if its a leaf in the tree
  if (!_.has(node, 'hasPart')) {
    // if its a leaf under the affected node, we need to modify the count
    // also the amount of children that are spread need to be more than one
    // or if its 1, the child needs not to be the one we modify
    if (isAffected) {
      node = addComposition(node, densityOrCount, modifiedValue);
    }
  }
  // if its not a leaf
  else {
    const ratioSpread = calculateRatioSpread(node, extendedNodeId, modifiedNode, lockedIds);
    let childrenWillBeAffected = isAffected;
    // the children of a node are marked as "affected" if they are children
    // of the parent of the changed node
    if (
      !isAffected &&
      _.has(node.hasPart, modifiedNode.id) &&
      (nodeId === modifiedNode.parentId || modifiedNode.parentId === null)
    ) {
      childrenWillBeAffected = true;
    }

    // for each child
    Object.entries(node.hasPart).forEach(([childId, child]) => {
      // if the child is locked, do not iterate in it
      if (!lockedIds.includes(childId) && !childIsLocked(lockedIds, extendedNodeId, childId)) {
        let childValue = modifiedValue;
        // if it is already affected or one of its children is the node we look for
        // then the child value is spread.
        if (isAffected || _.has(node.hasPart, modifiedNode.id)) {
          childValue = ratioSpread[childId] * modifiedValue;
        }
        // if the current visited child is a sibling of the modified one
        if (_.has(node.hasPart, modifiedNode.id) && childId !== modifiedNode.id) {
          childValue *= -1;
        }

        iterateLeafTree(
          child,
          childId,
          calculateNewExtendedNodeId(extendedNodeId, childId, child.about),
          modifiedNode,
          childrenWillBeAffected,
          childValue,
          lockedIds,
          densityOrCount
        );
      }
    });
  }
};

/**
 * It computes the modified composition based on node that was changed and the
 * difference that changed
 *
 * @param modifiedNode the node that is modified
 * @param changedAmount the amount that changed
 * @param affectedLeaves the leaf IDs that were modified
 * @param volumes the volumes of each leaf ID
 * @param compositionFile the previous composition file
 * @param lockedIds the array of IDs that are locked
 * @param densityOrCount whether density or count is currently selected
 */
const computeModifiedComposition = (
  modifiedNode: CompositionNode,
  changedAmount: number,
  affectedLeaves: string[],
  volumes: { [key: string]: number },
  compositionFile: Composition,
  lockedIds: string[],
  densityOrCount: string
) => {
  let volumeSum = 0;
  if (volumes) {
    // find the sum of volumes for all affected leaves
    affectedLeaves.forEach((leafId) => {
      volumeSum += volumes[leafId];
    });

    affectedLeaves.forEach((leafId) => {
      // find how much of value was changed for this leaf
      const leafChange = (changedAmount * volumes[leafId]) / volumeSum;
      const leaf = compositionFile.hasPart[leafId];
      // iterate the leaf to change its values
      iterateLeafTree(
        leaf,
        leafId,
        calculateNewExtendedNodeId('', leafId, leaf.about),
        modifiedNode,
        false,
        leafChange,
        lockedIds,
        densityOrCount
      );
    });
  }

  return _.cloneDeep(compositionFile);
};

export default computeModifiedComposition;

/* eslint-enable no-param-reassign */
