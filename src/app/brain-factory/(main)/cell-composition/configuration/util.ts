import { Composition, Link, Node } from '@/components/BrainRegionSelector';

export type SankeyLinksReducerAcc = {
  links: Link[];
  nodes: Node[];
  type: string;
  value: string;
};

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

export function sankeyLinksReducer(
  { links, nodes, type, value }: SankeyLinksReducerAcc,
  { source, target }: Link
) {
  const linkValue: number = (nodes.find(({ id }) => id === target) as any)[type][value];

  return { links: [...links, { source, target, value: linkValue }], nodes, type, value };
}

export interface AboutNode extends Node {
  nodes: AboutNode[];
  max: number;
  value: number;
}

export type EditorLinksProps = {
  accNodes: { [about: string]: AboutNode[] };
  allNodes: Node[];
  max: number;
};

export function editorlinksReducer(
  { accNodes, allNodes, max }: EditorLinksProps,
  { source, target }: Link
) {
  const {
    about,
    label,
    neuron_composition: sourceComposition,
  } = allNodes.find(({ id: nodeId }) => nodeId === source) || ({} as AboutNode);
  const targetIndex = allNodes.findIndex(({ id: nodeId }) => nodeId === target);
  const { label: targetLabel, neuron_composition: targetComposition } = allNodes[targetIndex];
  const existingAbout = Object.prototype.hasOwnProperty.call(accNodes, about);
  const existingNodeIndex =
    existingAbout && accNodes[about].findIndex((node) => node.id === source);
  const newAllNodes = allNodes.filter((node, i) => targetIndex !== i);

  return !existingAbout || existingNodeIndex === -1
    ? ({
        accNodes: {
          ...accNodes,
          [about as string]: [
            ...(existingAbout ? accNodes[about] : []),
            {
              id: source,
              label,
              max: targetComposition.count, // No need for math, as so-far there's only one value
              nodes: [
                {
                  id: target,
                  label: targetLabel,
                  value: targetComposition.count,
                },
              ],
              value: sourceComposition && sourceComposition.count,
            },
          ],
        },
        allNodes: newAllNodes,
        max: sourceComposition ? Math.max(max, sourceComposition.count) : max,
      } as EditorLinksProps)
    : ({
        accNodes: {
          ...accNodes,
          [about]: [
            ...accNodes[about].slice(0, existingNodeIndex as number),
            {
              ...accNodes[about][existingNodeIndex as number],
              max: Math.max(
                accNodes[about][existingNodeIndex as number].max,
                targetComposition.count
              ),
              nodes: [
                ...accNodes[about][existingNodeIndex as number].nodes,
                { id: target, label: targetLabel, value: targetComposition.count },
              ],
            },
            ...accNodes[about].slice((existingNodeIndex as number) + 1),
          ],
        },
        allNodes: newAllNodes,
        max: Math.max(max, sourceComposition.count),
      } as EditorLinksProps);
}
