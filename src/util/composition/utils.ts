import { TreeItem } from 'performant-array-to-tree';
import _ from 'lodash';

/**
 * Calculates the new extended node id
 *
 * if the previous extended node id is null, then the new one is the node id
 * if it is not null, then append it with __ and the the node id
 *
 * @param extendedNodeId
 * @param childNodeId
 * @param childAbout
 */
export const calculateNewExtendedNodeId = (
  extendedNodeId: string,
  childNodeId: string,
  childAbout: string
): string => {
  if (childAbout === 'BrainRegion') {
    return '';
  }
  if (extendedNodeId) {
    return `${extendedNodeId}__${childNodeId}`;
  }
  return childNodeId;
};

export const childIsLocked = (lockedIds: string[], extendedNodeId: string, childId: string) => {
  if (extendedNodeId) {
    return lockedIds.includes(`${extendedNodeId}__${childId}`);
  }
  return lockedIds.includes(childId);
};
/**
 * Calculates the max value that a neuron composition can take
 * @param relatedNodes the set of related nodes
 * @param id the id of the node
 * @param about the about value of the node
 * @param allLockedIds
 * @param neuronsToNodes
 */
export const calculateMax = (
  relatedNodes: string[],
  id: string,
  about: string,
  allLockedIds: string[],
  neuronsToNodes: { [id: string]: TreeItem }
) => {
  let max = 0;
  // The locked ids are provided in extended id (including hierarchy) so I simplify them
  // to include only the last part which is the actual ID
  const simpleIds = allLockedIds.map((lockedId) => lockedId.split('__').pop());
  relatedNodes.forEach((relatedNodeId: string) => {
    if (
      relatedNodeId in neuronsToNodes &&
      neuronsToNodes[relatedNodeId].about === about &&
      // if both relatedNodeId and id are locked or none of them
      (_.difference([id, relatedNodeId], simpleIds).length === 0 ||
        _.difference([id, relatedNodeId], simpleIds).length === 2)
    ) {
      max += neuronsToNodes[relatedNodeId].composition;
    }
  });
  return max;
};
