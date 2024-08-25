import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';

import useNeuronViewerEvents from './hooks/events-hook';
import useNeuronViewerActions from './hooks/actions-hook';
import NeuronLoader from './plugins/NeuronLoader';
import Renderer, { NeuronViewerConfig } from '@/services/bluenaas-single-cell/renderer';
import useMorphology from '@/hooks/useMorphology';

import { Morphology } from '@/services/bluenaas-single-cell/types';
import { secNamesAtom } from '@/state/simulate/single-neuron';
import { DEFAULT_DIRECT_STIM_CONFIG } from '@/constants/simulate/single-neuron';
import { basePath } from '@/config';

type Props = {
  modelSelfUrl: string;
  useEvents?: boolean;
  useActions?: boolean;
  useZoomer?: boolean;
  useCursor?: boolean;
  actions?: NeuronViewerConfig;
  children?: ({
    renderer,
    useZoomer,
    useCursor,
    useActions,
  }: {
    renderer: MutableRefObject<Renderer | null>;
    useZoomer?: boolean;
    useCursor?: boolean;
    useActions?: boolean;
  }) => React.ReactNode;
};

export default function NeuronViewer({
  children,
  modelSelfUrl,
  useZoomer,
  useEvents,
  useActions,
  useCursor,
  actions,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const cursorHoverRef = useRef<HTMLDivElement | null>(null);
  const setSecNames = useSetAtom(secNamesAtom);

  const setSectionsAndSegments = useCallback(
    (morphology: Morphology) => {
      const sectionNames = Object.keys(morphology);
      setSecNames(sectionNames);

      if (!sectionNames.includes(DEFAULT_DIRECT_STIM_CONFIG.injectTo)) {
        throw new Error('No soma section present');
      }
    },
    [setSecNames]
  );

  const runRenderer = useCallback(
    (morphology: Morphology) => {
      if (rendererRef.current && containerRef.current) {
        const prunedMorph = rendererRef.current.removeNoDiameterSection(morphology);
        rendererRef.current.addMorphology(prunedMorph);
        setSectionsAndSegments(prunedMorph);
      }
    },
    [setSectionsAndSegments]
  );

  useEffect(() => {
    if (!rendererRef.current && containerRef.current) {
      const renderer = new Renderer(containerRef.current, {});
      rendererRef.current = renderer;
    }
  }, []);

  const { loading } = useMorphology({
    modelSelfUrl,
    callback: runRenderer,
  });

  useNeuronViewerEvents({
    useEvents,
    cursor: cursorHoverRef,
    renderer: rendererRef,
  });

  useNeuronViewerActions({
    useActions,
    actions,
    renderer: rendererRef,
  });

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
          <NeuronLoader text="Loading Neuron" />
        </div>
      )}
      <div
        className="h-full"
        ref={containerRef}
        style={{
          cursor: `url(${basePath}/images/HandCursor.webp), pointer`,
        }}
      />
      {children?.({
        useZoomer,
        useCursor,
        useActions,
        renderer: rendererRef,
      })}
    </div>
  );
}
