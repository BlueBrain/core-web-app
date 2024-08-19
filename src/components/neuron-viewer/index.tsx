import { useCallback, useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';

import useNeuronViewerEvents from './events-hook';
import useNeuronViewerActions from './actions-hook';
import Renderer, { NeuronViewerConfig } from '@/services/bluenaas-single-cell/renderer';
import useMorphology from '@/hooks/useMorphology';
import { Morphology } from '@/services/bluenaas-single-cell/types';
import { secNamesAtom } from '@/state/simulate/single-neuron';
import { DEFAULT_DIRECT_STIM_CONFIG } from '@/constants/simulate/single-neuron';

type Props = {
  modelSelfUrl: string;
  useEvents?: boolean;
  useActions?: boolean;
  actions?: NeuronViewerConfig;
  children?: React.ReactNode;
};

export default function NeuronViewer({
  children,
  modelSelfUrl,
  useEvents,
  useActions,
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

  useMorphology({
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
    renderer: rendererRef,
    actions: {
      onClick: actions?.onClick,
    },
  });

  return (
    <div className="relative h-full w-full">
      <div className="h-screen" ref={containerRef} />
      <div
        className="absolute bottom-4 right-4 hidden h-max rounded-sm border bg-white px-2 py-2 text-primary-8 shadow-lg"
        ref={cursorHoverRef}
      />
      {children}
    </div>
  );
}