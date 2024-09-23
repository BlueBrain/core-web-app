import { MutableRefObject, use, useCallback, useEffect, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import useNeuronViewerEvents from './hooks/events-hook';
import useNeuronViewerActions from './hooks/actions-hook';
import NeuronLoader from './plugins/NeuronLoader';
import { DendrogramSwitch } from './DendrogramSwitch';
import Renderer, { NeuronViewerConfig } from '@/services/bluenaas-single-cell/renderer';
import useMorphology from '@/hooks/useMorphology';

import { Morphology } from '@/services/bluenaas-single-cell/types';
import { secNamesAtom } from '@/state/simulate/single-neuron';
import { DEFAULT_CURRENT_INJECTION_CONFIG } from '@/constants/simulate/single-neuron';
import { recordingSourceForSimulationAtom } from '@/state/simulate/categories/recording-source-for-simulation';
import { currentInjectionSimulationConfigAtom } from '@/state/simulate/categories/current-injection-simulation';
import { useDendrogram } from '@/services/dendrogram';

type Props = {
  modelSelfUrl: string;
  useEvents?: boolean;
  useActions?: boolean;
  useZoomer?: boolean;
  useCursor?: boolean;
  /**
   * If `true`, an overlay with the labels for Recording and Injection
   * will be added to the display.
   */
  useLabels?: boolean;
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
  useEvents,
  useActions,
  useZoomer,
  useCursor,
  useLabels,
  actions,
}: Props) {
  const [mode, setMode] = useState<'2d' | '3d'>('3d');
  const [ready, setReady] = useState(false);
  const dendrogram = useDendrogram(modelSelfUrl);
  const labelsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const setSecNames = useSetAtom(secNamesAtom);

  const setSectionsAndSegments = useCallback(
    (morphology: Morphology) => {
      const sectionNames = Object.keys(morphology);
      setSecNames(sectionNames);

      if (!sectionNames.includes(DEFAULT_CURRENT_INJECTION_CONFIG.injectTo)) {
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
        setReady(true);
      }
    },
    [setSectionsAndSegments]
  );

  useEffect(() => {
    if (!rendererRef.current && containerRef.current) {
      const renderer = new Renderer(containerRef.current, {});
      renderer.labels.canvas = labelsCanvasRef.current;
      rendererRef.current = renderer;
    }
  }, []);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    if (mode === '3d') renderer.transitionTo3D();
    else renderer.transitionToDendrogram(dendrogram);
  }, [ready, mode, dendrogram]);

  const { loading } = useMorphology({
    modelSelfUrl,
    callback: runRenderer,
  });

  useNeuronViewerEvents({
    useEvents,
    renderer: rendererRef,
  });

  useNeuronViewerActions({
    useActions,
    actions,
    renderer: rendererRef,
  });

  /**
   * In the future, we can have several stimulations.
   * But today, we have only one.
   */
  const stimulationId = 0;
  const injectionLocations = useAtomValue(currentInjectionSimulationConfigAtom);
  const recordLocations = useAtomValue(recordingSourceForSimulationAtom);
  if (useLabels) {
    rendererRef.current?.labels.update([
      {
        section: injectionLocations[stimulationId].injectTo,
        offset: 0.5,
      },
      ...recordLocations,
    ]);
  }

  return (
    <div className="relative h-full w-full">
      {(loading || !dendrogram) && (
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
          <NeuronLoader text="Loading Neuron" />
        </div>
      )}
      <div
        className="h-full"
        ref={containerRef}
        // NOTE: this is removed because it does not getting the exact pointer position due the scale and nature of the custom cursor
        // style={{
        //   cursor: `url(${basePath}/images/HandCursor.webp), pointer`,
        // }}
      />
      <canvas
        ref={labelsCanvasRef}
        className="pointer-events-none absolute left-0 top-0 size-full"
      />
      {children?.({
        useZoomer,
        useCursor,
        useActions,
        renderer: rendererRef,
      })}
      <DendrogramSwitch
        className="absolute bottom-0 left-0"
        visible={ready}
        value={mode}
        onChange={setMode}
      />
    </div>
  );
}
