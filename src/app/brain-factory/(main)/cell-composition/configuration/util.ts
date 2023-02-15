import { Link, Node } from '@/types/atlas';

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
