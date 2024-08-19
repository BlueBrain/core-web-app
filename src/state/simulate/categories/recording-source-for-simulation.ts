import { atom, useAtom } from 'jotai';

import { DEFAULT_RECORDING_LOCATION } from '@/constants/simulate/single-neuron';
import { RecordLocation } from '@/types/simulation/single-neuron';

export const recordingSourceForSimulationAtom = atom<Array<RecordLocation>>([
  { ...DEFAULT_RECORDING_LOCATION },
]);

recordingSourceForSimulationAtom.debugLabel = 'recordingSourceForSimulationAtom';

export default function useRecordingSourceForSimulation() {
  const [state, update] = useAtom(recordingSourceForSimulationAtom);

  function setSource(index: number, updatedLocation: Partial<RecordLocation>) {
    update(state.map((r, i) => (i === index ? { ...r, ...updatedLocation } : r)));
  }

  function add(location: RecordLocation) {
    update([...state, location]);
  }

  return {
    state,
    setSource,
    add,
  };
}