import _ from 'lodash';
import { CompositionNode } from '@/types/composition';

/**
 *  Given some sibling nodes, it counts the amount of locked siblings
 *  and the ones that are not locked
 * @param siblings the sibling nodes
 * @param lockedIds the locked ids
 */
export const findUnlockedSiblings = (siblings: CompositionNode[], lockedIds: string[]) => {
  let countLocked = 0;
  const unlockedIds: string[] = [];

  siblings?.forEach((sibling) => {
    const extendedNodeId = `root__${sibling.id}`;
    if (!lockedIds.includes(extendedNodeId)) {
      unlockedIds.push(extendedNodeId);
    } else {
      countLocked += 1;
    }
  });
  return { countLocked, unlockedIds };
};

/**
 * Calculates the system locked IDs. System locked IDs are the ones that are
 * locked by the system based on the ones locked by the user.
 *
 * The locking rules are the following:
 *
 * 1) If the node has children and it is an only child or all siblings are locked, it gets locked
 * 2) If All the children of a node are locked, the parent is locked as well
 * 3) if a parent gets locked by the user, its children are locked as well
 *
 */
const computeSystemLockedIds = (nodes: CompositionNode[], userLockedIds: string[]) => {
  let lockedIds: string[] = [];
  const groupByParent = _.groupBy(nodes, (node) => node.parentId);
  // first iterating over the children whose parent is not null
  Object.entries(groupByParent).forEach(([parentId, neuronChildren]) => {
    const parentLockId = `root__${parentId}`;
    // Rule No2: if all the children are locked, lock the parent
    if (
      neuronChildren.every((neuronChild) =>
        [...lockedIds, ...userLockedIds].includes(`${parentLockId}__${neuronChild.id}`)
      )
    ) {
      lockedIds.push(parentLockId);
    }

    // Rule No3: if the parent is locked, lock the children
    if (userLockedIds.includes(parentLockId)) {
      const childrenIds = neuronChildren.map((neuronChild) => `${parentLockId}__${neuronChild.id}`);
      lockedIds = [...lockedIds, ...childrenIds];
    }
  });

  const nullChildren = groupByParent.null;
  const { countLocked, unlockedIds } = findUnlockedSiblings(nullChildren, [
    ...userLockedIds,
    ...lockedIds,
  ]);
  // if all the children of the first level are locked but one,
  // then lock the last child as well
  if (countLocked === (nullChildren ? nullChildren.length : 0) - 1) {
    lockedIds = [...lockedIds, ...unlockedIds];
  }

  return lockedIds;
};

export default computeSystemLockedIds;
