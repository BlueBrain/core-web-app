import { useCallback, useEffect, useRef } from 'react';

import {
  DISPLAY_SYNAPSES_3D_EVENT,
  REMOVE_SYNAPSES_3D_EVENT,
  DisplaySynapses3DEvent,
  RemoveSynapses3DEvent,
} from './events';
import Renderer from '@/services/bluenaas-single-cell/renderer';
import { Morphology } from '@/services/bluenaas-single-cell/types';
import getMorphology from '@/services/bluenaas-synaptome/getMorphology';

type Props = {
  modelSelfUrl: string;
};

function useMorphology({
  modelSelfUrl,
  callback,
}: {
  modelSelfUrl: string;
  callback: (morphology: Morphology) => void;
}) {
  const readMorphology = useCallback(async (): Promise<Morphology> => {
    const response = await getMorphology({ modelId: modelSelfUrl });
    const reader = response.body?.getReader();
    let data: string = '';
    let value: Uint8Array | undefined;
    let done: boolean = false;
    const decoder = new TextDecoder();
    if (reader) {
      while (!done) {
        ({ done, value } = await reader.read());
        const decodedChunk = decoder.decode(value, { stream: true });
        data += decodedChunk;
      }
    }
    return JSON.parse(data);
  }, [modelSelfUrl]);

  useEffect(() => {
    (async function start() {
      const morphology = await readMorphology();
      callback(morphology);
    })();
  }, [callback, readMorphology]);
}

export default function NeuronModelView({ modelSelfUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);

  const runRenderer = useCallback((morphology: Morphology) => {
    if (!rendererRef.current && containerRef.current) {
      const renderer = new Renderer(containerRef.current, {});
      rendererRef.current = renderer;
      const prunedMorph = renderer.removeNoDiameterSection(morphology);
      renderer.addMorphology(prunedMorph);
    }
  }, []);

  useEffect(() => {
    function displaySynapses3DEventHandler(event: DisplaySynapses3DEvent) {
      if (rendererRef.current) {
        const { objects } = event.detail;
        rendererRef.current.addSynapses(objects);
      }
    }

    function removeSynapses3DEventHandler(event: RemoveSynapses3DEvent) {
      if (rendererRef.current) {
        const { objects } = event.detail;
        if (objects) {
          rendererRef.current.removeSynapses(objects);
        }
      }
    }

    window.addEventListener(
      DISPLAY_SYNAPSES_3D_EVENT,
      displaySynapses3DEventHandler as EventListener
    );
    window.addEventListener(
      REMOVE_SYNAPSES_3D_EVENT,
      removeSynapses3DEventHandler as EventListener
    );

    return () => {
      window.removeEventListener(
        DISPLAY_SYNAPSES_3D_EVENT,
        displaySynapses3DEventHandler as EventListener
      );
      window.removeEventListener(
        REMOVE_SYNAPSES_3D_EVENT,
        removeSynapses3DEventHandler as EventListener
      );
    };
  }, []);

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
