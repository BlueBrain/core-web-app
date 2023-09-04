export interface SetComparaisonResult<T> {
  common: T[];
  onlyInA: T[];
  onlyInB: T[];
}

export function compareSets<T>(
  setOrArrayA: Set<T> | T[],
  setOrArrayB: Set<T> | T[]
): SetComparaisonResult<T> {
  const result: SetComparaisonResult<T> = {
    common: [],
    onlyInA: [],
    onlyInB: [],
  };
  const setA = Array.isArray(setOrArrayA) ? new Set(setOrArrayA) : setOrArrayA;
  const setB = Array.isArray(setOrArrayB) ? new Set(setOrArrayB) : setOrArrayB;
  setA.forEach((itemFromA) => {
    if (setB.has(itemFromA)) result.common.push(itemFromA);
    else result.onlyInA.push(itemFromA);
  });
  setB.forEach((itemFromB) => {
    if (!setA.has(itemFromB)) result.onlyInB.push(itemFromB);
  });
  return result;
}
