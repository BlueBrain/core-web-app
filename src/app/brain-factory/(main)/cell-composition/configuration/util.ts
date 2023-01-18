import { switchStateType } from '@/util/common';
import round from '@/services/distribution-sliders/round';
import { Composition, Link, Node } from '@/components/BrainRegionSelector/types';

export const DENSITY_DECIMAL_PLACES = 4;
export const COUNT_DECIMAL_PLACES = 0;

export function sankeyNodesReducer(acc: Node[], cur: Node) {
  const existingNodeIndex = acc.findIndex((node: Node) => node.id === cur.id);
  const existingNode = acc[existingNodeIndex];

  return existingNode
    ? [
        ...acc.slice(0, existingNodeIndex),
        {
          ...existingNode,
          neuron_composition: {
            count:
              (existingNode.neuron_composition as Composition).count +
              (cur.neuron_composition as Composition).count,
            density:
              (existingNode.neuron_composition as Composition).density +
              (cur.neuron_composition as Composition).density,
          },
        },
        ...acc.slice(existingNodeIndex + 1),
      ]
    : [...acc, cur];
}

export function getSankeyLinks(links: Link[], nodes: Node[], type: string, value: string) {
  const sankeyLinks: Link[] = [];
  links.forEach(({ source, target }: Link) => {
    const linkValue = (
      nodes.find((node: Node) => node.id === target && node.parent_id === source) as any
    )[type][value];
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
  densityOrCount: keyof Composition
): Node[] {
  const newNodes = [...nodes];

  let newCountValue: number | null = null;
  let newDensityValue: number | null = null;

  if (densityOrCount === switchStateType.COUNT && sliderValue !== null) {
    newCountValue = round(sliderValue, COUNT_DECIMAL_PLACES);
  } else if (densityOrCount === switchStateType.DENSITY && sliderValue !== null) {
    newDensityValue = round(sliderValue, DENSITY_DECIMAL_PLACES);
  } else {
    throw new Error(`Unhandled slider key value = '${densityOrCount}'`);
  }

  // Normalize values in the same "about"-group
  const parallelNodes = newNodes.filter((n) =>
    parentId === null ? n.about === about : n.parent_id === parentId
  );
  const activeNode = parallelNodes.find((n) => n.id === changedNode.id) as Node;
  const otherNodes = parallelNodes.filter((n) => n.id !== changedNode.id);

  const oldCountValue = activeNode.neuron_composition.count;
  const oldDensityValue = activeNode.neuron_composition.density;

  const totalCountValue = parallelNodes.reduce(
    (previousValue, currentValue) => previousValue + currentValue.neuron_composition.count,
    0
  );
  const totalDensityValue = parallelNodes.reduce(
    (previousValue, currentValue) => previousValue + currentValue.neuron_composition.density,
    0
  );

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

  activeNode.neuron_composition.count = newCountValue;
  activeNode.neuron_composition.density = newDensityValue;

  // Recalculate parallel nodes to keep same total value
  const totalOldCountRemaining = totalCountValue - oldCountValue;
  const totalNewCountRemaining = totalCountValue - newCountValue;

  const totalNewDensityRemaining = totalDensityValue - newDensityValue;

  let newCountRemaining = totalNewCountRemaining;
  let newDensityRemaining = totalNewDensityRemaining;

  otherNodes.forEach((node, index, array) => {
    const last = index === array.length - 1;
    const nOld = node.neuron_composition.count;
    let nRatio = nOld / totalOldCountRemaining;

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

    otherNodes[index].neuron_composition.count = nCountValue;
    otherNodes[index].neuron_composition.density = nDensityValue;
  });

  parallelNodes.forEach((node) => {
    const childNodes = newNodes.filter((n) => n.parent_id === node.id);
    const currentTotalCountValue = childNodes.reduce(
      (previousValue, currentValue) => previousValue + currentValue.neuron_composition.count,
      0
    );

    const newTotalTargetCountValue = node.neuron_composition.count;
    const newTotalTargetDensityValue = node.neuron_composition.density;

    let newChildCountRemaining = newTotalTargetCountValue;
    let newChildDensityRemaining = newTotalTargetDensityValue;

    childNodes.forEach((childNode, index, array) => {
      const last = index === array.length - 1;
      const oldChildCountValue = childNode.neuron_composition.count;
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

      childNodes[index].neuron_composition.count = newChildCountValue;
      childNodes[index].neuron_composition.density = newChildDensityValue;
    });
  });

  return newNodes;
}
