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
