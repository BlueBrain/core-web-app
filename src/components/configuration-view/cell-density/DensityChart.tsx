import React, { useEffect } from 'react';
import sankey from './sankey';
import { Composition, Densities, Link, Node } from '@/components/BrainRegionSelector';

// This hook creates a React RefObject, attaches it to a new SVG element.
// It then passes the ref to a callback, which should be a function that
// constructs a D3 chart.
function useD3(callback: Function, className: string, ...args: any) {
  const ref: React.RefObject<SVGSVGElement> = React.useRef(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.innerHTML = ''; // Prevent duplication

      callback(...args, ref);
    }
  });

  return <svg className={className} ref={ref} />;
}

type DensityChartProps = {
  className?: string;
  data: Densities;
};

function nodesReducer(acc: any, cur: any) {
  const existingNodeIndex = acc.findIndex((node: any) => node.id === cur.id);
  const existingNode = acc[existingNodeIndex];

  return existingNode
    ? [
        ...acc.slice(0, existingNodeIndex),
        {
          ...existingNode,
          neuron_composition: {
            density:
              (existingNode.neuron_composition as Composition).density +
              (cur.neuron_composition as Composition).density,
          },
        },
        ...acc.slice(existingNodeIndex + 1),
      ]
    : [...acc, cur];
}

type LinkReducerAcc = {
  links: Link[] | [];
  nodes: Node[] | [];
  type: string;
  value: string;
};

function linkReducer({ links, nodes, type, value }: LinkReducerAcc, { source, target }: Link) {
  const linkValue: number = (nodes.find((node) => node.id === target) as any)[type][value];

  return { links: [...links, { source, target, value: linkValue }], nodes, type, value };
}

export default function DensityChart({ className = '', data }: DensityChartProps) {
  const { nodes, links } = data;
  const nodesAndLinks = links.reduce(linkReducer, {
    links: [],
    nodes: nodes.reduce(nodesReducer, []),
    type: 'neuron_composition',
    value: 'density',
  } as LinkReducerAcc);

  return useD3(sankey, className, nodesAndLinks, {
    linkColor: 'source',
    linkTitle: (d: Link) => `${d.source} → ${d.target}\n${d.value}`,
    linkValue: (d: Link) => d.value,
    nodeGroup: (d: Node) => d.id,
    nodeGroups: ['NeurotransmitterType', 'EType', 'MType', 'BrainLayer'],
    nodeLabel: (d: Node) => d.label,
    nodeAlign: 'left',
    width: 860,
  });
}
