import { atom, useAtom } from 'jotai';

export const DEFAULT_RECORD_SOURCE = 'soma[0]_0';
export const recordingSourceForSimulationAtom = atom<Array<string>>([DEFAULT_RECORD_SOURCE]);
recordingSourceForSimulationAtom.debugLabel = 'recordingSourceForSimulationAtom';

export default function useRecordingSourceForSimulation() {
  const [state, update] = useAtom(recordingSourceForSimulationAtom);

  function setSource(newValue: Array<string>) {
    update(newValue);
  }

  return {
    state,
    setSource,
  };
}
