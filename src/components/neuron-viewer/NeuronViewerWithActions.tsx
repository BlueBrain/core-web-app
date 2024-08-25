'use client';

import { useState } from 'react';

import { CursorPopover, InjectionRecordingPopover } from './plugins';
import Zoomer from './plugins/CustomZoomer';
import NeuronViewer from '@/components/neuron-viewer';
import {
  NeuronViewerClickData,
  NeuronViewerHoverHoverData,
} from '@/services/bluenaas-single-cell/renderer';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';

export default function NeuronViewerContainer({ modelUrl }: { modelUrl: string }) {
  const [disbaleHovering, setDisableHovering] = useState(false);
  const [neuronViewerClickData, setNeuronViewerOnClickData] =
    useState<NeuronViewerClickData | null>(null);
  const [neuronViewerHoverData, setNeuronViewerOnHoverData] =
    useState<NeuronViewerHoverHoverData | null>(null);

  return (
    <DefaultLoadingSuspense>
      <NeuronViewer
        useZoomer
        useCursor
        useEvents
        useActions
        modelSelfUrl={modelUrl}
        actions={{
          onClick: (data) => {
            setNeuronViewerOnClickData(data);
            setDisableHovering(true);
          },
          onHover: setNeuronViewerOnHoverData,
          onHoverEnd: () => setNeuronViewerOnHoverData(null),
        }}
      >
        {({ renderer, useActions, useCursor, useZoomer }) => {
          return (
            <>
              {useActions && neuronViewerClickData && (
                <InjectionRecordingPopover
                  show={!!neuronViewerClickData}
                  data={{
                    x: neuronViewerClickData.position.x,
                    y: neuronViewerClickData.position.y,
                    section: neuronViewerClickData.data.section,
                    offset: neuronViewerClickData.data.offset,
                  }}
                  onClose={() => {
                    setNeuronViewerOnClickData(null);
                    setDisableHovering(false);
                  }}
                />
              )}
              {useCursor && neuronViewerHoverData && !disbaleHovering && (
                <CursorPopover
                  show={!!neuronViewerHoverData}
                  x={neuronViewerHoverData.position.x}
                  y={neuronViewerHoverData.position.y}
                  data={neuronViewerHoverData.data}
                />
              )}
              {useZoomer && <Zoomer renderer={renderer} />}
            </>
          );
        }}
      </NeuronViewer>
    </DefaultLoadingSuspense>
  );
}
