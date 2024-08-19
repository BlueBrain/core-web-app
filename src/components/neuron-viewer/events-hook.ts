import { MutableRefObject, useEffect } from 'react';

import {
  DISPLAY_SYNAPSES_3D_EVENT,
  REMOVE_SYNAPSES_3D_EVENT,
  DisplaySynapses3DEvent,
  RemoveSynapses3DEvent,
} from './events';
import {
  HoveredSegmentDetailsEvent,
  SEGMENT_DETAILS_EVENT,
} from '@/services/bluenaas-single-cell/events';
import Renderer from '@/services/bluenaas-single-cell/renderer';

export default function useNeuronViewerEvents({
  renderer,
  cursor,
  useEvents = false,
}: {
  useEvents?: boolean;
  renderer: MutableRefObject<Renderer | null>;
  cursor: MutableRefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    if (!useEvents) return;

    const eventAborter = new AbortController();

    function displaySynapses3DEventHandler(event: DisplaySynapses3DEvent) {
      if (renderer.current) {
        const { mesh } = event.detail;
        renderer.current.addSynapses(mesh);
      }
    }

    function removeSynapses3DEventHandler(event: RemoveSynapses3DEvent) {
      if (renderer.current) {
        const { meshId } = event.detail;
        if (meshId) {
          renderer.current.removeSynapses(meshId);
        }
      }
    }

    function segmentDetailsEventHandler(event: HoveredSegmentDetailsEvent) {
      if (cursor.current) {
        if (event.detail.show) {
          cursor.current.setAttribute('style', 'display: flex;');
          // eslint-disable-next-line no-param-reassign
          cursor.current.innerHTML = `<pre><code>${JSON.stringify(event.detail.data, null, 2)}</code></pre>`;
        } else {
          // eslint-disable-next-line no-param-reassign
          cursor.current.innerText = '';
          cursor.current.setAttribute('style', 'display: none;');
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
  }, [cursor, renderer, useEvents]);
}
