import cloneDeep from 'lodash/cloneDeep';
import { OriginalComposition, OriginalCompositionNode } from '@/types/composition/original';
import { childIsLocked } from '@/util/composition/utils';
import { CalculatedCompositionNode } from '@/types/composition/calculation';

/* eslint-disable no-param-reassign */

/**
 * Calculates the value spread of the children of a node
 *
 * @param node the parentNode
 * @param extendedNodeId the extended node id of te visited node
 * @param modifiedNode the node that was modified
 * @param lockedIds the array of IDs that are locked
 */
export const calculateRatioSpread = (
  node: OriginalCompositionNode,
  extendedNodeId: string,
  modifiedNode: CalculatedCompositionNode,
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
      siblingsSum += child.composition.neuron.density;
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
      child.composition.neuron.density < 2
    ) {
      valueSpread[childId] = 0;
    } else if (!childIsLocked(lockedIds, extendedNodeId, childId)) {
      // if its a sibling then the spread is the value/sum
      valueSpread[childId] = child.composition.neuron.density / siblingsSum;
    }
  });
  return valueSpread;
};

/**
 * Given the previous and new value of a node, calculates the ratio change that it should receive
 *
 * @param previousDensityValue
 * @param newDensityValue
 */
export const calculateDensityRatioChange = (
  previousDensityValue: number,
  newDensityValue: number
) => {
  if (previousDensityValue !== 0) {
    return newDensityValue / previousDensityValue;
  }
  // when the previous density value is 0, we return as ratio the new density value (by convention)
  return newDensityValue;
};

/**
 * Applies a new density to an existing leafnode
 * @param nodeToModify the node to apply the new density
 * @param ratioChange the ratio to change it by
 */
export const applyNewDensity = (nodeToModify: OriginalCompositionNode, ratioChange: number) => {
  if (nodeToModify.composition.neuron.density !== 0) {
    nodeToModify.composition.neuron.density = Math.max(
      nodeToModify.composition.neuron.density * ratioChange,
      0
    );
  } else {
    // when the previous density value is 0, we set directly the new density value
    // since multiplication by 0 would lead to 0
    nodeToModify.composition.neuron.density = Math.max(ratioChange, 0);
  }
};

/**
 * Iterates down a tree and when reaches the leaves, applies the ratio change
 *
 * @param node
 * @param ratioChange
 * @param volume
 */
export const iterateAndApplyDensityChange = (
  node: OriginalCompositionNode,
  ratioChange: number,
  volume: number
) => {
  if (node.hasPart) {
    Object.values(node.hasPart).forEach((child) => {
      iterateAndApplyDensityChange(child, ratioChange, volume);
    });
  } else {
    applyNewDensity(node, ratioChange);
  }
};

/**
 * It calculates the density change and applies it iteratively down the tree for each
 * affected node
 *
 * @param modifiedNode
 * @param parentNode
 * @param densityChangeRatio
 * @param lockedIds
 * @param volume
 */
export const calculateAndApplyDensityChange = (
  modifiedNode: CalculatedCompositionNode,
  parentNode: OriginalCompositionNode,
  densityChangeRatio: number,
  lockedIds: string[],
  volume: number
) => {
  const previousDensity = parentNode.hasPart[modifiedNode.id].composition.neuron.density;
  const newDensity = previousDensity * densityChangeRatio;
  const modifiedNodeValueDiff = newDensity - previousDensity;
  const spread = calculateRatioSpread(
    parentNode,
    parentNode.extendedNodeId,
    modifiedNode,
    lockedIds
  );
  iterateAndApplyDensityChange(parentNode.hasPart[modifiedNode.id], densityChangeRatio, volume);
  Object.entries(parentNode.hasPart).forEach(([childId, child]) => {
    // avoiding the modified node since the change was already done
    if (childId !== modifiedNode.id) {
      // the amount of density change that the child will get
      const childDensityDiff = spread[childId] * modifiedNodeValueDiff;
      const previousChildDensity = child.composition.neuron.density;
      const newChildDensity = previousChildDensity - childDensityDiff;
      const childDensityRatioChange = calculateDensityRatioChange(
        previousChildDensity,
        newChildDensity
      );
      iterateAndApplyDensityChange(child, childDensityRatioChange, volume);
    }
  });
};

/**
 * Finds the parent of the affected node
 *
 * @param extendedNodeId
 * @param node the node that is currently visited
 */
export const findParentOfAffected = (extendedNodeId: string, node: OriginalCompositionNode) => {
  let foundNode: OriginalCompositionNode | null = null;
  if (node.hasPart) {
    if (Object.values(node.hasPart).find((child) => child.extendedNodeId === extendedNodeId)) {
      return node;
    }
    Object.values(node.hasPart).forEach((child) => {
      if (!foundNode) {
        foundNode = findParentOfAffected(extendedNodeId, child);
      }
    });
  }
  return foundNode;
};

/**
 * It computes the modified composition based on node that was changed and the
 * difference that changed
 *
 * @param modifiedNode the node that is modified
 * @param changedAmount the amount that changed
 * @param affectedLeaves the leaf IDs that were modified
 * @param compositionFile the previous composition file
 * @param lockedIds the array of IDs that are locked
 * @param densityOrCount whether we modify density or count
 * @param volumes a map of brain regions => volumes
 * @param selectedBrainRegionId the id of the selected brain region
 */
const computeModifiedComposition = (
  modifiedNode: CalculatedCompositionNode,
  changedAmount: number,
  affectedLeaves: string[],
  compositionFile: OriginalComposition,
  lockedIds: string[],
  densityOrCount: string,
  volumes: { [key: string]: number },
  selectedBrainRegionId: string
) => {
  if (modifiedNode.composition !== undefined && selectedBrainRegionId in volumes) {
    let previousDensity = modifiedNode.composition;
    let densityDiff = changedAmount;
    // if we change count, convert counts to densities
    if (densityOrCount === 'count') {
      previousDensity = modifiedNode.composition / volumes[selectedBrainRegionId];
      densityDiff = changedAmount / volumes[selectedBrainRegionId];
    }
    const changeRatio = calculateDensityRatioChange(previousDensity, previousDensity + densityDiff);
    affectedLeaves.forEach((leafId) => {
      // find how much of value was changed for this leaf
      const leaf = compositionFile.hasPart[leafId];
      const affectedParent = findParentOfAffected(modifiedNode.extendedNodeId, leaf);
      if (affectedParent) {
        const volume = volumes[leafId];
        calculateAndApplyDensityChange(
          modifiedNode,
          affectedParent,
          changeRatio,
          lockedIds,
          volume
        );
      }
    });
  }

  return cloneDeep(compositionFile);
};

export default computeModifiedComposition;

/* eslint-enable no-param-reassign */
