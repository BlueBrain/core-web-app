import _ from 'lodash';
import { CompositionNode } from '@/types/composition';

/**
 * Given a parent and its children, it counts the amount of locked children
 *  and the ones that are not locked
 * @param children the children nodes
 * @param lockedIds the locked ids
 */
const findUnlockedChildren = (children: CompositionNode[], lockedIds: string[]) => {
  let countLocked = 0;
  const unlockedIds: string[] = [];
  children?.forEach((neuron) => {
    if (!lockedIds.includes(neuron.id)) {
      unlockedIds.push(neuron.id);
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
 * 1) If the node has only one child, this child get locked
 * 2) If All the children of a parent are locked, the parent is locked as well
 * 3) if a parent gets locked by the user, its children are locked as well
 * 4) In the first level, if all but one child are locked, the last one gets
 *    locked as well
 *
 */
const computeSystemLockedIds = (nodes: CompositionNode[], userLockedIds: string[]) => {
  let lockedIds: string[] = [];
  const groupByParent = _.groupBy(nodes, (node) => node.parentId);
  // first iterating over the children whose parent is not null
  Object.entries(groupByParent).forEach(([parentId, neuronChildren]) => {
    // if the node has only one child, we lock it
    if (neuronChildren.length === 1) {
      lockedIds.push(`${parentId}__${neuronChildren[0].id}`);
    }

    // if all the children are locked, lock the parent
    if (
      neuronChildren.every((neuronChild) =>
        [...lockedIds, ...userLockedIds].includes(`${parentId}__${neuronChild.id}`)
      )
    ) {
      lockedIds.push(parentId);
    }

    // if the parent is locked, lock the children
    if (userLockedIds.includes(parentId)) {
      const childrenIds = neuronChildren.map((neuronChild) => `${parentId}__${neuronChild.id}`);
      lockedIds = [...lockedIds, ...childrenIds];
    }
  });
  // then iterating over the children whose parent is null
  const nullChildren = groupByParent.null;
  const { countLocked, unlockedIds } = findUnlockedChildren(nullChildren, [
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
