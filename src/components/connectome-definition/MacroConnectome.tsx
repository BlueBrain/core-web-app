import { selectedPostBrainRegionsAtom, selectedPreBrainRegionsAtom } from '@/state/brain-regions';
import { brainRegionsFilteredTreeAtom } from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import connectivityMatrix from './connectivity-dummy.json';

function findLeaves(tree: BrainRegion[]) {
  const leaveIds: string[] = [];
  const queue = [...tree];

  while (queue.length) {
    const r = queue.shift();
    if (!r) continue;
    if (!r.items || r.items.length === 0) leaveIds.push(r.id);
    r.items?.forEach((r) => queue.push(r));
  }

  return leaveIds;
}

export default function MacroConnectome() {
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);
  const tree = useAtomValue(brainRegionsFilteredTreeAtom) ?? [];
  const leaves = useMemo(() => new Set(findLeaves(tree)), [tree]);

  const preSynapticIds = useMemo(
    () =>
      Array.from(preSynapticBrainRegions)
        .map(([id, _]) => id)
        .filter((id) => leaves.has(id)),
    [preSynapticBrainRegions, leaves]
  );

  const postSynapticIds = useMemo(
    () =>
      Array.from(postSynapticBrainRegions)
        .map(([id, _]) => id)
        .filter((id) => leaves.has(id)),
    [postSynapticBrainRegions, leaves]
  );

  console.log(preSynapticIds, postSynapticIds);

  return (
    <div style={{ gridArea: 'matrix-container', position: 'relative' }}>
      <Plot
        data={[
          {
            z: connectivityMatrix.densities,
            x: connectivityMatrix.parcellation,
            y: connectivityMatrix.parcellation,
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
