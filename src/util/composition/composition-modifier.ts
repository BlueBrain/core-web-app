import cloneDeep from 'lodash/cloneDeep';
import { OriginalComposition, OriginalCompositionNode } from '@/types/composition/original';
import { CalculatedCompositionNode } from '@/types/composition/calculation';

/* eslint-disable no-param-reassign */

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
 * @param densityOrCount whether we modify density or count
 * @param volumes a map of brain regions => volumes
 * @param selectedBrainRegionId the id of the selected brain region
 */
const computeModifiedComposition = (
  modifiedNode: CalculatedCompositionNode,
  changedAmount: number,
  affectedLeaves: string[],
  compositionFile: OriginalComposition,
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
        iterateAndApplyDensityChange(affectedParent.hasPart[modifiedNode.id], changeRatio, volume);
      }
    });
  }

  return cloneDeep(compositionFile);
};

export default computeModifiedComposition;

/* eslint-enable no-param-reassign */
