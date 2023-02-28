'use client';

import { useAtomValue } from 'jotai/react';
import { selectedPostBrainRegionsAtom, selectedPreBrainRegionsAtom } from '@/state/brain-regions';

export default function ConnectomeDefinitionView() {
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);

  return (
    <div className="p-4 flex-col flex">
      <h3>Connectome definition</h3>

      {preSynapticBrainRegions.size !== 0 && (
        <span>
          Pre-synaptic brain region: {Array.from(preSynapticBrainRegions.values()).join(', ')}
        </span>
      )}
      {postSynapticBrainRegions.size !== 0 && (
        <span>
          Post-synaptic brain region: {Array.from(postSynapticBrainRegions.values()).join(', ')}
        </span>
      )}
    </div>
  );
}
