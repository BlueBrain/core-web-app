'use client';

import { Suspense } from 'react';
import { useAtomValue } from 'jotai/react';
import { selectedPostBrainRegionsAtom, selectedPreBrainRegionsAtom } from '@/state/brain-regions';

function ConnectomeDefinitionMain() {
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);
  return (
    <div className="p-4 flex-col flex">
      <h3>Connectome definition</h3>

      {!!preSynapticBrainRegions.length && (
        <span>
          Pre-synaptic brain region: {preSynapticBrainRegions.map((r) => r.title).join(', ')}
        </span>
      )}
      {!!postSynapticBrainRegions.length && (
        <span>
          Post-synaptic brain region: {postSynapticBrainRegions.map((r) => r.title).join(', ')}
        </span>
      )}
    </div>
  );
}
export default function ConnectomeDefinitionView() {
  return (
    <Suspense fallback={null}>
      <ConnectomeDefinitionMain />
    </Suspense>
  );
}
