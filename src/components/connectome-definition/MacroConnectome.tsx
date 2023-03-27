import {
  brainRegionsFilteredArrayAtom,
  selectedPostBrainRegionsAtom,
  selectedPreBrainRegionsAtom,
} from '@/state/brain-regions';
import { brainRegionsFilteredTreeAtom } from '@/state/brain-regions';
import { BrainArea } from '@/state/connectome-editor/sidebar';
import { BrainRegion } from '@/types/ontologies';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import connectivityMatrix from './connectivity-dummy2.json';

function findLeaves(tree: BrainRegion[]) {
  const leaves: BrainRegion[] = [];
  const queue = [...tree];

  while (queue.length) {
    const r = queue.shift();
    if (!r) continue;
    if (!r.items || r.items.length === 0) leaves.push(r);
    r.items?.forEach((r) => queue.push(r));
  }

  return leaves;
}

type ConnectivityMatrix = { [id: string]: { [id: string]: { s: number; d: number } } };

function getDensitiesForNodes(leafNodes: BrainRegion[], connectivity: ConnectivityMatrix) {
  const filteredDensities: number[][] = [];
  const notConnectionFoundList: string[] = [];

  const parcellationNames: string[] = [];

  leafNodes.forEach((node) => {
    const sourceId = node.id;
    const targetObj = connectivity[sourceId];

    const leafIds = leafNodes.map((node) => node.id);

    if (!targetObj) {
      notConnectionFoundList.push(sourceId);
      return;
    }
    parcellationNames.push(node.title);

    const targetList: number[] = [];
    Object.keys(targetObj).forEach((targetId) => {
      if (leafIds.includes(targetId)) {
        targetList.push(targetObj[targetId]['d']);
      }
    });
    filteredDensities.push(targetList);
  });

  console.log('Ids not found in connectivity', notConnectionFoundList.length);

  // check the shape of the matrix is correct
  const diff = filteredDensities.some(
    (targetList) => targetList.length !== filteredDensities.length
  );
  console.log('Matrix is square', !diff);

  return [filteredDensities, parcellationNames];
}

export default function MacroConnectome() {
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const tree = useAtomValue(brainRegionsFilteredTreeAtom) ?? [];
  const brainRegions = useAtomValue(brainRegionsFilteredArrayAtom) ?? [];
  const leaves = useMemo(() => findLeaves(tree), [tree]);
  const leafIds = useMemo(() => new Set(leaves.map((l) => l.id)), [leaves]);

  const preSynapticIds = useMemo(
    () =>
      Array.from(preSynapticBrainRegions)
        .map(([id, _]) => id)
        .filter((id) => leafIds.has(id)),
    [preSynapticBrainRegions, leafIds]
  );

  const selectedRegions = useMemo(
    () => preSynapticIds.map((id) => brainRegions.find((br) => br.id == id)).filter((br) => !!br),
    [brainRegions, preSynapticIds]
  ) as BrainRegion[];

  const [filteredDensities, parcellationNames] = useMemo(
    () => getDensitiesForNodes(selectedRegions, connectivityMatrix as ConnectivityMatrix),
    [selectedRegions]
  );

  return (
    <div style={{ gridArea: 'matrix-container', position: 'relative' }}>
      <Plot
        data={[
          {
            z: filteredDensities,
            x: parcellationNames,
            y: parcellationNames,
            type: 'heatmap',
            colorscale: 'Hot',
          },
        ]}
        layout={{
          width: 500,
          height: 500,
          paper_bgcolor: '#000',
          xaxis: {
            color: '#DCDCDC',
            tickfont: {
              size: 7,
            },
          },
          yaxis: {
            color: '#DCDCDC',
            tickfont: {
              size: 7,
            },
          },
        }}
      />
    </div>
  );
}
