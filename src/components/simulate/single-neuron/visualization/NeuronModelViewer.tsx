import { useCallback, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { Morphology, SecMarkerConfig } from '@/services/bluenaas-single-cell/types';
import { secNamesAtom, segNamesAtom } from '@/state/simulate/single-neuron';
import { DEFAULT_DIRECT_STIM_CONFIG, DEFAULT_SIM_CONFIG } from '@/constants/simulate/single-neuron';
import { recordingSourceForSimulationAtom } from '@/state/simulate/categories/recording-source-for-simulation';
import { directCurrentInjectionSimulationConfigAtom } from '@/state/simulate/categories/direct-current-injection-simulation';
import Renderer from '@/services/bluenaas-single-cell/renderer';
import useMorphology from '@/hooks/useMorphology';

type Props = {
  modelSelfUrl: string;
};

export default function NeuronModelViewer({ modelSelfUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);

  const setSecNames = useSetAtom(secNamesAtom);
  const setSegNames = useSetAtom(segNamesAtom);
  const recordFrom = useAtomValue(recordingSourceForSimulationAtom);
  const directStimulation = useAtomValue(directCurrentInjectionSimulationConfigAtom);

  const ensureSecMarkers = useCallback(() => {
    rendererRef.current?.ensureSecMarkers([
      { type: 'stimulus', secName: directStimulation![0].injectTo }, // TODO: directStimulation should not be hard coded.
      ...recordFrom.map<SecMarkerConfig>((segName) => ({
        type: 'recording',
        secName: segName.replace(/_.*/, ''),
        segIdx: parseInt(segName.match(/_(\d+)$/)?.[1] ?? '0', 10),
      })),
    ]);
  }, [directStimulation, recordFrom]);

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
        ensureSecMarkers();
      }
    },
    [setSectionsAndSegments, ensureSecMarkers]
  );

  useMorphology({
    modelSelfUrl,
    callback: runRenderer,
  });

  return (
    <div className="relative h-full w-full">
      <div className="h-screen" ref={containerRef} />
    </div>
  );
}
