import { CalculatedCompositionNode, CompositionLink } from '@/types/composition/calculation';

export function sankeyNodesReducer(
  acc: CalculatedCompositionNode[],
  cur: CalculatedCompositionNode
) {
  const existingNodeIndex = acc.findIndex((node: CalculatedCompositionNode) => node.id === cur.id);
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

export function filterOutEmptyNodes(
  nodes: CalculatedCompositionNode[],
  type: string,
  value: string
) {
  // @ts-ignore
  return nodes.filter((node) => node[type][value] > 0);
}

export function getSankeyLinks(
  links: CompositionLink[],
  nodes: CalculatedCompositionNode[],
  type: string,
  value: string
) {
  const sankeyLinks: CompositionLink[] = [];
  links.forEach(({ source, target }: CompositionLink) => {
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
