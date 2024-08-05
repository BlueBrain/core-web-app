import { useCallback, useEffect, useRef } from 'react';

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
import getMorphology from '@/services/bluenaas-synaptome/getMorphology';
import Renderer from '@/services/bluenaas-single-cell/renderer';

type Props = {
  modelSelfUrl: string;
};

export function useMorphology({
  modelSelfUrl,
  callback,
}: {
  modelSelfUrl: string;
  callback: (morphology: Morphology) => void;
}) {
  const mountedRef = useRef(false);
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
    mountedRef.current = true;

    async function start() {
      if (mountedRef.current) {
        const morphology = await readMorphology();
        mountedRef.current = false;
        callback(morphology);
      }
    }

    start();

    return () => {
      mountedRef.current = false;
    };
  }, [callback, readMorphology, mountedRef]);
}

export default function NeuronModelView({ modelSelfUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const cursorHoverRef = useRef<HTMLDivElement | null>(null);

  const runRenderer = useCallback((morphology: Morphology) => {
    if (!rendererRef.current && containerRef.current) {
      const renderer = new Renderer(containerRef.current, {});
      rendererRef.current = renderer;
      const prunedMorph = renderer.removeNoDiameterSection(morphology);
      renderer.addMorphology(prunedMorph);
    }
  }, []);

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
