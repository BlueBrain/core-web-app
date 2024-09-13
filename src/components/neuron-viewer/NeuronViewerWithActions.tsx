'use client';

import { useState } from 'react';

import { CursorPopover, InjectionRecordingPopover } from './plugins';
import Zoomer from './plugins/CustomZoomer';
import NeuronViewer from '@/components/neuron-viewer';
import {
  NeuronViewerClickData,
  NeuronViewerHoverData,
} from '@/services/bluenaas-single-cell/renderer';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';

type Props = {
  modelUrl: string;
  zoomPlacement?: 'left' | 'right';
  useZoomer?: boolean;
  useCursor?: boolean;
  useEvents?: boolean;
  useActions?: boolean;
  useLabels?: boolean;
};
export default function NeuronViewerContainer({
  modelUrl,
  zoomPlacement = 'right',
  useZoomer = false,
  useCursor = false,
  useEvents = false,
  useActions = false,
  useLabels = false,
}: Props) {
  const [disbaleHovering, setDisableHovering] = useState(() => !useActions);
  const [neuronViewerClickData, setNeuronViewerOnClickData] =
    useState<NeuronViewerClickData | null>(null);
  const [neuronViewerHoverData, setNeuronViewerOnHoverData] =
    useState<NeuronViewerHoverData | null>(null);

  return (
    <DefaultLoadingSuspense>
      <NeuronViewer
        modelSelfUrl={modelUrl}
        actions={{
          onClick: (data) => {
            setNeuronViewerOnClickData(data);
            setDisableHovering(true);
          },
          onHover: setNeuronViewerOnHoverData,
          onHoverEnd: () => setNeuronViewerOnHoverData(null),
        }}
        {...{
          useZoomer,
          useCursor,
          useEvents,
          useActions,
          useLabels,
        }}
      >
        {({
          renderer,
          useActions: enableActions,
          useCursor: enableCursor,
          useZoomer: enableZoom,
        }) => {
          return (
            <>
              {enableActions && neuronViewerClickData && (
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
              {enableCursor && neuronViewerHoverData && !disbaleHovering && (
                <CursorPopover
                  show={!!neuronViewerHoverData}
                  x={neuronViewerHoverData.position.x}
                  y={neuronViewerHoverData.position.y}
                  data={neuronViewerHoverData.data}
                />
              )}
              {enableZoom && <Zoomer renderer={renderer} placement={zoomPlacement} />}
            </>
          );
        }}
      </NeuronViewer>
    </DefaultLoadingSuspense>
  );
}
