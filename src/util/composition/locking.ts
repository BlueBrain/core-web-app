import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';
import difference from 'lodash/difference';
import { CalculatedCompositionNode } from '@/types/composition/calculation';

/**
 *  Given some sibling nodes, it counts the amount of locked siblings
 *  and the ones that are not locked
 * @param siblings the sibling nodes
 * @param lockedIds the locked ids
 */
export const findUnlockedSiblings = (
  siblings: CalculatedCompositionNode[],
  lockedIds: string[]
) => {
  let countLocked = 0;
  const unlockedIds: string[] = [];

  siblings?.forEach((sibling) => {
    if (!lockedIds.includes(sibling.extendedNodeId)) {
      unlockedIds.push(sibling.extendedNodeId);
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
 * 1) If a node is an only child or all siblings are locked, it gets locked
 * 2) If All the children of a node are locked, the parent is locked as well
 * 3) if a parent gets locked by the user, its children are locked as well
 *
 */
export const computeSystemLockedIds = (
  nodes: CalculatedCompositionNode[],
  userAndBlockedNodeIds: string[]
) => {
  let lockedIds: string[] = [];
  const groupByParent = groupBy(nodes, (node) => node.parentId);
  // first iterating over the children whose parent is not null
  Object.entries(groupByParent).forEach(([parentId, neuronChildren]) => {
    // Rule No2: if all the children are locked, lock the parent
    if (
      neuronChildren.every((neuronChild) =>
        [...lockedIds, ...userAndBlockedNodeIds].includes(`${parentId}__${neuronChild.id}`)
      )
    ) {
      lockedIds.push(parentId);
    }

    const { countLocked, unlockedIds } = findUnlockedSiblings(neuronChildren, [
      ...userAndBlockedNodeIds,
      ...lockedIds,
    ]);

    if (countLocked === (neuronChildren ? neuronChildren.length : 0) - 1) {
      lockedIds = [...lockedIds, ...unlockedIds];
    }

    // Rule No3: if the parent is locked, lock the children
    if (userAndBlockedNodeIds.includes(parentId)) {
      const childrenIds = neuronChildren.map((neuronChild) => `${parentId}__${neuronChild.id}`);
      lockedIds = [...lockedIds, ...childrenIds];
    }
  });

  const nullChildren = groupByParent.null;
  const { countLocked, unlockedIds } = findUnlockedSiblings(nullChildren, [
    ...userAndBlockedNodeIds,
    ...lockedIds,
  ]);
  // if all the children of the first level are locked but one,
  // then lock the last child as well
  if (countLocked === (nullChildren ? nullChildren.length : 0) - 1) {
    lockedIds = [...lockedIds, ...unlockedIds];
  }

  return uniq(lockedIds);
};

/**
 * Iterates and computes the system locked ids. The loop is there so that in the
 * next iteration it will take into consideration the results of the previous
 * locking iteration
 *
 * @param nodes the nodes list
 * @param userAndBlockedNodeIds the node ids of user and blocked ids
 */
const iterateAndComputeSystemLockedIds = (
  nodes: CalculatedCompositionNode[],
  userAndBlockedNodeIds: string[]
) => {
  let systemLockedIds: string[] = [];
  let allIds = [...userAndBlockedNodeIds];
  let diff;
  let newSystemLockedIds;
  do {
    newSystemLockedIds = computeSystemLockedIds(nodes, allIds);
    diff = difference(newSystemLockedIds, allIds);
    systemLockedIds = [...systemLockedIds, ...newSystemLockedIds];
    allIds = [...allIds, ...newSystemLockedIds];
  } while (diff.length !== 0);
  return uniq(systemLockedIds);
};

export default iterateAndComputeSystemLockedIds;
