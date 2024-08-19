import { useState } from 'react';

import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import NeuronMeshInjectionRecordingPopover from '@/components/neuron-viewer/NeuronMeshInjectionRecordingPopover';
import NeuronViewer from '@/components/neuron-viewer';
import { ClickData as NeuronViewerClickData } from '@/services/bluenaas-single-cell/renderer';

export default function NeuronViewerContainer({ modelUrl }: { modelUrl: string }) {
  const [neuronViewerClickData, setNeuronViewerOnClickData] =
    useState<NeuronViewerClickData | null>(null);

  return (
    <DefaultLoadingSuspense>
      <NeuronViewer
        useEvents
        useActions
        modelSelfUrl={modelUrl}
        actions={{
          onClick: setNeuronViewerOnClickData,
        }}
      >
        {neuronViewerClickData && (
          <NeuronMeshInjectionRecordingPopover
            show={!!neuronViewerClickData}
            data={{
              x: neuronViewerClickData.position.x,
              y: neuronViewerClickData.position.y,
              section: neuronViewerClickData.data.section,
              segmentOffset: neuronViewerClickData.data.offset,
            }}
            onClose={() => setNeuronViewerOnClickData(null)}
          />
        )}
      </NeuronViewer>
    </DefaultLoadingSuspense>
  );
}
