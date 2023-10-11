import { CalculatedCompositionNode, CompositionLink } from '@/types/composition/calculation';

export function getSankeyNodesReducer(
  selectedNodes: string[],
  sankeyLinks: CompositionLink[],
  densityOrCount: 'density' | 'count'
) {
  return function sankeyNodesReducer(
    acc: CalculatedCompositionNode[],
    cur: CalculatedCompositionNode
  ) {
    const existingNodeIndex = acc.findIndex((node) => node.id === cur.id);
    const existingNode = acc[existingNodeIndex];

    const isSelected = selectedNodes.includes(cur.id);
    const isLinkTarget = sankeyLinks.map(({ target }) => target).includes(cur.id);

    const addNew =
      (cur.neuronComposition[densityOrCount] > 0 && !selectedNodes.length) ||
      isSelected ||
      isLinkTarget
        ? [...acc, cur]
        : acc;

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
      : addNew;
  };
}

export function getSankeyLinks(
  links: CompositionLink[],
  nodes: CalculatedCompositionNode[],
  densityOrCount: 'density' | 'count',
  selectedNodes: string[]
) {
  return links.reduce<CompositionLink[]>((acc, { source, target }) => {
    const value = nodes.find(
      (node) =>
        node.neuronComposition[densityOrCount] > 0 && node.id === target && node.parentId === source
    )?.neuronComposition[densityOrCount];

    return value && (!selectedNodes.length || selectedNodes.includes(source))
      ? [
          ...acc,
          {
            source,
            target,
            value,
          },
        ]
      : acc;
  }, []);
}
