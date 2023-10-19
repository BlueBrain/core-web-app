import { Dispatch, SetStateAction } from 'react';
import set from 'lodash/fp/set';
import getOr from 'lodash/fp/getOr';

import { NavValue } from '@/components/TreeNavItem';

export function handleNavValueChange(
  navValue: NavValue,
  setNavValue: Dispatch<SetStateAction<NavValue>>
) {
  return (newValue: string[], path: string[]) => {
    const nestedValue = newValue.length
      ? newValue.reduce(
          (acc, cur) => ({ ...acc, [cur]: getOr(null, [...path, cur], navValue) }),
          {}
        )
      : null;
    const newNavVal = path.length ? set(path, nestedValue, navValue as {}) : nestedValue;

    return setNavValue(newNavVal);
  };
}

/**
 * each node in the brain region heirarchy tree has a path array that contains a list
 * of all the node that will lead to it by navigation the tree as isocortex: [root, Cerebrum, cerebral cortex, cortical plate]
 * this function will generate a tree based on this table -> { root: { Cerebrum: { cerebral cortex: { cortical plate: null } } }
 * @param ancestors Array<string> path that lead to specific node
 * @returns HierarchyVisitedTree | null tree of brain region heirarchy
 */
export function generateHierarchyPathTree(ancestors: string[]) {
  if (ancestors.length === 0) {
    return null;
  }

  // use destructing instead of array.shift because 'shift' is mutable
  const [head, ...rest] = ancestors;
  if (!head) return null;

  const tree: NavValue = {};
  tree[head as keyof NavValue] = generateHierarchyPathTree(rest);

  return tree;
}
