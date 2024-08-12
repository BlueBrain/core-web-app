import { useCallback, useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';

import {
  DISPLAY_SYNAPSES_3D_EVENT,
  REMOVE_SYNAPSES_3D_EVENT,
  DisplaySynapses3DEvent,
  RemoveSynapses3DEvent,
} from './events';
import { Morphology } from '@/services/bluenaas-single-cell/types';
import {
  HoveredSegmentDetailsEvent,
  SEGMENT_DETAILS_EVENT,
} from '@/services/bluenaas-single-cell/events';
import { secNamesAtom, segNamesAtom } from '@/state/simulate/single-neuron';
import { DEFAULT_DIRECT_STIM_CONFIG, DEFAULT_SIM_CONFIG } from '@/constants/simulate/single-neuron';
import Renderer from '@/services/bluenaas-single-cell/renderer';
import useMorphology from '@/hooks/useMorphology';

type Props = {
  modelSelfUrl: string;
};

export default function NeuronModelView({ modelSelfUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const cursorHoverRef = useRef<HTMLDivElement | null>(null);
  const setSecNames = useSetAtom(secNamesAtom);
  const setSegNames = useSetAtom(segNamesAtom);

  const setSectionsAndSegments = useCallback(
    (morphology: Morphology) => {
      const sectionNames = Object.keys(morphology);
      const segNames = sectionNames.reduce<string[]>(
        (names, sectionName) => [
          ...names,
          ...morphology[sectionName].diam.map(
            (_: number, segIdx: number) => `${sectionName}_${segIdx}`
          ),
        ],
        []
      );
      setSecNames(sectionNames);
      setSegNames(segNames);

      if (!sectionNames.includes(DEFAULT_DIRECT_STIM_CONFIG.injectTo)) {
        throw new Error('No soma section present');
      }
      if (!segNames.includes(DEFAULT_SIM_CONFIG.recordFrom[0])) {
        throw new Error('No soma segment present');
      }
    },
    [setSecNames, setSegNames]
  );

  const runRenderer = useCallback(
    (morphology: Morphology) => {
      if (!rendererRef.current && containerRef.current) {
        const renderer = new Renderer(containerRef.current, {});
        rendererRef.current = renderer;
        const prunedMorph = renderer.removeNoDiameterSection(morphology);
        renderer.addMorphology(prunedMorph);
        setSectionsAndSegments(prunedMorph);
      }
    },
    [setSectionsAndSegments]
  );

  useEffect(() => {
    const eventAborter = new AbortController();

    function displaySynapses3DEventHandler(event: DisplaySynapses3DEvent) {
      if (rendererRef.current) {
        const { mesh } = event.detail;
        rendererRef.current.addSynapses(mesh);
      }
    }

    function removeSynapses3DEventHandler(event: RemoveSynapses3DEvent) {
      if (rendererRef.current) {
        const { meshId } = event.detail;
        if (meshId) {
          rendererRef.current.removeSynapses(meshId);
        }
      }
    }

    function segmentDetailsEventHandler(event: HoveredSegmentDetailsEvent) {
      if (cursorHoverRef.current) {
        if (event.detail.show) {
          cursorHoverRef.current.setAttribute('style', 'display: flex;');
          cursorHoverRef.current.innerHTML = `<pre><code>${JSON.stringify(event.detail.data, null, 2)}</code></pre>`;
        } else {
          cursorHoverRef.current.innerText = '';
          cursorHoverRef.current.setAttribute('style', 'display: none;');
        }
      }
    }

    window.addEventListener(
      DISPLAY_SYNAPSES_3D_EVENT,
      displaySynapses3DEventHandler as EventListener,
      {
        signal: eventAborter.signal,
      }
    );
    window.addEventListener(
      REMOVE_SYNAPSES_3D_EVENT,
      removeSynapses3DEventHandler as EventListener,
      {
        signal: eventAborter.signal,
      }
    );
    window.addEventListener(SEGMENT_DETAILS_EVENT, segmentDetailsEventHandler as EventListener, {
      signal: eventAborter.signal,
    });

    return () => {
      eventAborter.abort();
    };
  }, []);

  useMorphology({
    modelSelfUrl,
    callback: runRenderer,
  });

  return (
    <div className="relative h-full w-full">
      <div className="h-screen" ref={containerRef} />
      <div
        className="absolute bottom-4 right-4 hidden h-max rounded-sm border bg-white px-2 py-2 text-primary-8 shadow-lg"
        ref={cursorHoverRef}
      />
    </div>
  );
}
