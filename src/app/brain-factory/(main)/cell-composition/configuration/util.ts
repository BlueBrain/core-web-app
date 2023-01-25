import { Composition, CompositionUnit, Link, Node } from '@/types/atlas';
import { switchStateType } from '@/util/common';
import round from '@/services/distribution-sliders/round';

export const DENSITY_DECIMAL_PLACES = 0;
export const COUNT_DECIMAL_PLACES = 0;

export function sankeyNodesReducer(acc: Node[], cur: Node) {
  const existingNodeIndex = acc.findIndex((node: Node) => node.id === cur.id);
  const existingNode = acc[existingNodeIndex];

  return existingNode
    ? [
        ...acc.slice(0, existingNodeIndex),
        {
          ...existingNode,
          neuronComposition: {
            count: existingNode.neuronComposition.count + cur.neuronComposition.count,
            density: existingNode.neuronComposition.density + cur.neuronComposition.density,
          },
        },
        ...acc.slice(existingNodeIndex + 1),
      ]
    : [...acc, cur];
}

export function filterOutEmptyNodes(nodes: Node[], type: string, value: string) {
  // @ts-ignore
  return nodes.filter((node) => node[type][value] > 0);
}

export function getSankeyLinks(links: Link[], nodes: Node[], type: string, value: string) {
  const sankeyLinks: Link[] = [];
  links.forEach(({ source, target }: Link) => {
    const linkValue = (nodes.find((node) => node.id === target && node.parentId === source) as any)[
      type
    ][value];
    if (linkValue > 0) {
      sankeyLinks.push({
        source,
        target,
        value: linkValue,
      });
    }
  });
  return sankeyLinks;
}

export function sumArray(values: number[]) {
  return values.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
}

export function recalculateAndGetNewNodes(
  about: string,
  changedNode: Node,
  sliderValue: number | null,
  nodes: Node[],
  parentId: string | null,
  densityOrCount: keyof CompositionUnit,
  lockedNodeIds: string[]
): Node[] {
  const newNodes = [...nodes];

  let newCountValue: number | null = null;
  let newDensityValue: number | null = null;

  // Normalize values in the same "about"-group
  const parallelNodes = newNodes.filter((n) =>
    parentId === null
      ? n.about === about && !lockedNodeIds.includes(n.id)
      : n.parentId === parentId && !lockedNodeIds.includes(`${parentId}__${n.id}`)
  );

  if (parallelNodes.length === 1) {
    // If there's only one active parallel node, you don't modify anything.
    // Recalculation isn't possible since it can't change its value
    // (= no available nodes to transfer values to/from)
    return newNodes;
  }

  // We assume that we always find the node
  const activeNode = parallelNodes.find((n) => n.id === changedNode.id) as Node;
  const siblingNodes = parallelNodes.filter((n) => n.id !== changedNode.id);

  const oldCountValue = activeNode.neuronComposition.count;
  const oldDensityValue = activeNode.neuronComposition.density;

  const totalCountValue = parallelNodes.reduce(
    (previousValue, currentValue) => previousValue + currentValue.neuronComposition.count,
    0
  );
  const totalDensityValue = parallelNodes.reduce(
    (previousValue, currentValue) => previousValue + currentValue.neuronComposition.density,
    0
  );

  if (densityOrCount === switchStateType.COUNT && sliderValue !== null) {
    newCountValue = Math.min(round(sliderValue, COUNT_DECIMAL_PLACES), totalCountValue);
  } else if (densityOrCount === switchStateType.DENSITY && sliderValue !== null) {
    newDensityValue = Math.min(round(sliderValue, DENSITY_DECIMAL_PLACES), totalDensityValue);
  } else {
    throw new Error(`Unhandled slider key value = '${densityOrCount}'`);
  }

  // Set the value for the affected node as provided in the slider/input
  let newValueRatio: number;

  if (newCountValue !== null) {
    newValueRatio = newCountValue / oldCountValue;
    newDensityValue = round(oldDensityValue * newValueRatio, DENSITY_DECIMAL_PLACES);
  } else if (newDensityValue !== null) {
    newValueRatio = newDensityValue / oldDensityValue;
    newCountValue = round(oldCountValue * newValueRatio, COUNT_DECIMAL_PLACES);
  }

  if (newDensityValue === null || newCountValue === null) {
    throw new Error('Calculated density or count values must not be null.');
  }

  activeNode.neuronComposition.count = newCountValue;
  activeNode.neuronComposition.density = newDensityValue;

  // Recalculate parallel nodes to keep same total value
  const totalOldCountRemaining = totalCountValue - oldCountValue;
  const totalNewCountRemaining = totalCountValue - newCountValue;

  const totalOldDensityRemaining = totalDensityValue - oldDensityValue;
  const totalNewDensityRemaining = totalDensityValue - newDensityValue;

  let newCountRemaining = totalNewCountRemaining;
  let newDensityRemaining = totalNewDensityRemaining;

  siblingNodes.forEach((node, index, array) => {
    const last = index === array.length - 1;
    const nCountOld = node.neuronComposition.count;
    const nDensityOld = node.neuronComposition.density;
    const nCountRatio = nCountOld / totalOldCountRemaining;
    const nDensityRatio = nDensityOld / totalOldDensityRemaining;

    let nRatio = densityOrCount === 'count' ? nCountRatio : nDensityRatio;

    if (Number.isNaN(nRatio)) {
      nRatio = 1 / array.length;
    }

    // Count
    let nCountValue = round(nRatio * totalNewCountRemaining, COUNT_DECIMAL_PLACES);
    newCountRemaining -= nCountValue;
    if (newCountRemaining < 0 || last) {
      nCountValue += newCountRemaining;
    }
    nCountValue = round(nCountValue, COUNT_DECIMAL_PLACES);
    if (nCountValue < 0) {
      nCountValue = 0;
    }

    // Density
    let nDensityValue = round(nRatio * totalNewDensityRemaining, DENSITY_DECIMAL_PLACES);
    newDensityRemaining -= nDensityValue;
    if (newDensityRemaining < 0 || last) {
      nDensityValue += newDensityRemaining;
    }
    nDensityValue = round(nDensityValue, DENSITY_DECIMAL_PLACES);
    if (nDensityValue < 0) {
      nDensityValue = 0;
    }

    siblingNodes[index].neuronComposition.count = nCountValue;
    siblingNodes[index].neuronComposition.density = nDensityValue;
  });

  parallelNodes.forEach((node) => {
    const childNodes = newNodes.filter((n) => n.parentId === node.id);
    const currentTotalCountValue = childNodes.reduce(
      (previousValue, currentValue) => previousValue + currentValue.neuronComposition.count,
      0
    );

    const newTotalTargetCountValue = node.neuronComposition.count;
    const newTotalTargetDensityValue = node.neuronComposition.density;

    let newChildCountRemaining = newTotalTargetCountValue;
    let newChildDensityRemaining = newTotalTargetDensityValue;

    childNodes.forEach((childNode, index, array) => {
      const last = index === array.length - 1;
      const oldChildCountValue = childNode.neuronComposition.count;
      let childRatio = oldChildCountValue / currentTotalCountValue;

      if (Number.isNaN(childRatio)) {
        childRatio = 1 / array.length;
      }

      let newChildCountValue = round(childRatio * newTotalTargetCountValue, COUNT_DECIMAL_PLACES);
      let newChildDensityValue = round(
        childRatio * newTotalTargetDensityValue,
        DENSITY_DECIMAL_PLACES
      );

      newChildCountRemaining -= newChildCountValue;
      newChildDensityRemaining -= newChildDensityValue;

      if (newChildCountRemaining < 0 || last) {
        newChildCountValue += newChildCountRemaining;
      }
      if (newChildDensityRemaining < 0 || last) {
        newChildDensityValue += newChildDensityRemaining;
      }

      if (newChildCountValue < 0) {
        newChildCountValue = 0;
      }
      if (newChildDensityValue < 0) {
        newChildDensityValue = 0;
      }

      childNodes[index].neuronComposition.count = newChildCountValue;
      childNodes[index].neuronComposition.density = newChildDensityValue;
    });
  });

  return newNodes;
}

/**
 * This function prepares the composition data to be used with the Sankey diagram and the sliders.
 * It basically rounds up the count and density values to the required decimal place (i.e. the whole number).
 * After that, it makes sure that the value of the parent node matches the sum of its children values.
 *
 * It returns a new object.
 */
export function sanitizeNodeValues(composition: Composition) {
  const newComposition = structuredClone<Composition>(composition);

  // Round up the values
  newComposition.nodes
    .filter((childNode) => !!childNode.parentId)
    .forEach((childNode) => {
      // eslint-disable-next-line no-param-reassign
      childNode.neuronComposition.count = round(
        childNode.neuronComposition.count,
        COUNT_DECIMAL_PLACES
      );
      // eslint-disable-next-line no-param-reassign
      childNode.neuronComposition.density = round(
        childNode.neuronComposition.density,
        DENSITY_DECIMAL_PLACES
      );
    });

  // Sum
  newComposition.nodes
    .filter((value) => value.parentId == null)
    .forEach((parentNode) => {
      // eslint-disable-next-line no-param-reassign
      parentNode.neuronComposition.count = newComposition.nodes
        .filter((childNode) => childNode.parentId === parentNode.id)
        .reduce(
          (previousValue, currentValue) => previousValue + currentValue.neuronComposition.count,
          0
        );
      // eslint-disable-next-line no-param-reassign
      parentNode.neuronComposition.density = newComposition.nodes
        .filter((childNode) => childNode.parentId === parentNode.id)
        .reduce(
          (previousValue, currentValue) => previousValue + currentValue.neuronComposition.density,
          0
        );
    });
  return newComposition;
}
