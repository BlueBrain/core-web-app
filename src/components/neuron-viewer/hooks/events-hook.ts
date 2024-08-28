import { MutableRefObject, useEffect } from 'react';

import {
  DISPLAY_SYNAPSES_3D_EVENT,
  REMOVE_SYNAPSES_3D_EVENT,
  RESET_SYNAPSES_3D_EVENT,
  DisplaySynapses3DEvent,
  RemoveSynapses3DEvent,
} from './events';
import Renderer from '@/services/bluenaas-single-cell/renderer';

export default function useNeuronViewerEvents({
  renderer,
  useEvents = false,
}: {
  useEvents?: boolean;
  renderer: MutableRefObject<Renderer | null>;
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
          renderer.current.removeSingleSynapseSet(meshId);
        }
      }
    }

    function resetSynapses3DEventHandler() {
      if (renderer.current) {
        renderer.current.deleteAllSynapseSets();
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

    window.addEventListener(RESET_SYNAPSES_3D_EVENT, resetSynapses3DEventHandler as EventListener, {
      signal: eventAborter.signal,
    });

    return () => {
      eventAborter.abort();
    };
  }, [renderer, useEvents]);
}
