import _ from 'lodash';
import { LeafNode, Composition, CompositionUnit, CompositionNode } from '@/types/composition';

/* eslint-disable no-param-reassign */

/**
 * Calculates the value spread of the children of a node
 *
 * @param nodeId the ID of the currently visited node
 * @param node the parentNode
 * @param value the value that will be spread
 * @param modifiedNode the node that was modified
 * @param lockedIds the array of IDs that are locked
 * @param densityOrCount
 */
const calculateValueSpread = (
  nodeId: string,
  node: LeafNode,
  value: number,
  modifiedNode: CompositionNode,
  lockedIds: string[],
  densityOrCount: string
): { [key: string]: number } => {
  // if the modifiedNodeId is part of the children then the value
  // is spread between the siblings of the node
  const valueSpread: { [key: string]: number } = {};
  let siblingsSum = 0;
  let modifiedSiblingsAmount = 0;
  Object.entries(node.hasPart).forEach(([childId, child]) => {
    // if the child is a sibling of the one that is modified and its not locked
    // then we count them as part of the total sum
    if (
      childId !== modifiedNode.id &&
      !lockedIds.includes(childId) &&
      !lockedIds.includes(`${nodeId}__${childId}`)
    ) {
      modifiedSiblingsAmount += 1;
      siblingsSum += child.composition.neuron[densityOrCount as keyof CompositionUnit];
    }
  });
  siblingsSum = Math.round(siblingsSum * 100) / 100;
  Object.entries(node.hasPart).forEach(([childId, child]) => {
    // if the child is the one that is modified, the value will be the whole change
    if (childId === modifiedNode.id) {
      valueSpread[childId] = value;
    }
    // Specific case where all siblings that will spread the value sum to almost 0
    else if (siblingsSum < 0.1) {
      valueSpread[childId] = value / modifiedSiblingsAmount;
    } else if (!lockedIds.includes(childId) && !lockedIds.includes(`${nodeId}__${childId}`)) {
      // if its a sibling then the spread is the value*ratio
      const previousValue = child.composition.neuron[densityOrCount as keyof CompositionUnit];
      const ratio = previousValue / siblingsSum;
      valueSpread[childId] = value * ratio;
    }
  });
  return valueSpread;
};

/**
 * Iterates recursively the tree of a leaf in order to reach the bottom and modify
 * the values. In the process, it splits the changed value when needed.
 *
 * @param node the currently visited node
 * @param nodeId
 * @param modifiedNode the node that is modified
 * @param isAffected whether the node is affected or not
 * @param modifiedValue the change of value
 * @param lockedIds the array of IDs that are locked
 * @param densityOrCount whether density or count is currently selected
 * @param amountOfSpread
 */
export const iterateLeafTree = (
  node: LeafNode,
  nodeId: string,
  modifiedNode: CompositionNode,
  isAffected: Boolean,
  modifiedValue: number,
  lockedIds: string[],
  densityOrCount: string,
  amountOfSpread: number
) => {
  // if its a leaf in the tree
  if (!_.has(node, 'hasPart')) {
    // if its a leaf under the affected node, we need to modify the count
    // also the amount of children that are spread need to be more than one
    // or if its 1, the child needs not to be the one we modify
    if (isAffected && (amountOfSpread > 1 || modifiedNode.id !== nodeId)) {
      // name of the other field from the one selected
      const otherField = densityOrCount === 'count' ? 'density' : 'count';
      let previousValue = node.composition.neuron[densityOrCount as keyof CompositionUnit];
      // hack to avoid division by 0 when a value goes to 0
      // This issue will probably be avoided in the next implementation based
      // on multiplication instead of addition
      if (previousValue === 0) {
        previousValue = 0.1;
      }
      const changePercentage = modifiedValue / previousValue;
      // case to avoid negative values
      node.composition.neuron[densityOrCount as keyof CompositionUnit] = Math.max(
        node.composition.neuron[densityOrCount as keyof CompositionUnit] + modifiedValue,
        0
      );
      const densityModifiedValue = node.composition.neuron[otherField] * changePercentage;
      node.composition.neuron[otherField] = Math.max(
        (node.composition.neuron[otherField] += densityModifiedValue),
        0
      );
    }
  }
  // if its not a leaf
  else {
    const valueSpread = calculateValueSpread(
      nodeId,
      node,
      modifiedValue,
      modifiedNode,
      lockedIds,
      densityOrCount
    );
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
      if (!lockedIds.includes(childId) && !lockedIds.includes(`${nodeId}__${childId}`)) {
        let childValue = modifiedValue;
        // if it is already affected or one of its children is the node we look for
        // then the child value is spread.
        if (isAffected || _.has(node.hasPart, modifiedNode.id)) {
          childValue = valueSpread[childId];
        }
        // if the current visited child is a sibling of the modified one
        if (_.has(node.hasPart, modifiedNode.id) && childId !== modifiedNode.id) {
          childValue *= -1;
        }
        iterateLeafTree(
          child,
          childId,
          modifiedNode,
          childrenWillBeAffected,
          childValue,
          lockedIds,
          densityOrCount,
          Object.keys(valueSpread).length
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
      iterateLeafTree(leaf, leafId, modifiedNode, false, leafChange, lockedIds, densityOrCount, 0);
    });
  }

  return _.cloneDeep(compositionFile);
};

export default computeModifiedComposition;

/* eslint-enable no-param-reassign */
