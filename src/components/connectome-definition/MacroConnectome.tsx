import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { selectedPostBrainRegionsAtom, selectedPreBrainRegionsAtom } from '@/state/brain-regions';

type ConnectivityMatrix = { [id: string]: { [id: string]: { s: number; d: number } } };

function getDensitiesForNodes(
  sourceNodes: { id: string; title: string }[],
  targetNodes: { id: string; title: string }[],
  connectivity: ConnectivityMatrix
) {
  const filteredDensities: number[][] = [];
  const parcellationNames: string[] = [];

  sourceNodes.forEach((node) => {
    const sourceId = node.id;
    const targetObj = connectivity[sourceId];

    const targetIds = new Set(targetNodes.map((n) => n.id));

    if (!targetObj) return;

    parcellationNames.push(node.title);

    const targetList: number[] = [];
    Object.keys(targetObj).forEach((targetId) => {
      if (targetIds.has(targetId)) {
        targetList.push(targetObj[targetId].d);
      }
    });
    filteredDensities.push(targetList);
  });

  return [filteredDensities, parcellationNames];
}

export default function MacroConnectome() {
  const [connectivityMatrix, setConnectivityMatrix] = useState<ConnectivityMatrix>({});
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);

  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);
  const selectedPreSynapticBrainRegions = useMemo(
    () => Array.from(preSynapticBrainRegions).map(([id, title]) => ({ id, title })),
    [preSynapticBrainRegions]
  );

  const selectedPostSynapticBrainRegions = useMemo(
    () => Array.from(postSynapticBrainRegions).map(([id, title]) => ({ id, title })),
    [postSynapticBrainRegions]
  );

  const [filteredDensities, parcellationNames] = useMemo(
    () =>
      getDensitiesForNodes(
        selectedPreSynapticBrainRegions,
        selectedPostSynapticBrainRegions,
        connectivityMatrix
      ),
    [selectedPreSynapticBrainRegions, selectedPostSynapticBrainRegions, connectivityMatrix]
  );

  useEffect(() => {
    async function fetchConnectivity() {
      const protocol = window.location.hostname === 'localhost' ? 'http' : 'https';
      const res = await fetch(`${protocol}://${window.location.host}/connectivity-dummy.json`);
      const json = await res.json();
      setConnectivityMatrix(json);
    }

    fetchConnectivity();
  }, []);

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
