import { useAtom } from 'jotai';

import { atomWithReset } from 'jotai/utils';
import updateArray from '@/util/updateArray';
import {
  CurrentInjectionSimulationConfig,
  StimulusType,
  StimulusModule,
} from '@/types/simulation/single-neuron';
import {
  DEFAULT_CURRENT_INJECTION_CONFIG,
  PROTOCOL_DETAILS,
} from '@/constants/simulate/single-neuron';

export const currentInjectionSimulationConfigAtom = atomWithReset<
  Array<CurrentInjectionSimulationConfig>
>([DEFAULT_CURRENT_INJECTION_CONFIG]);
currentInjectionSimulationConfigAtom.debugLabel = 'directCurrentInjectionSimulationConfigAtom';

export default function useCurrentInjectionSimulationConfig() {
  const [state, update] = useAtom(currentInjectionSimulationConfigAtom);

  function findConfig(id: number) {
    const stimConfig = state.find((config: CurrentInjectionSimulationConfig) => config.id === id);
    if (!stimConfig) {
      throw new Error(`No stimulation config for id ${id} exists`);
    }
    return stimConfig;
  }

  function setMode({ id, newValue }: { id: number; newValue: StimulusType }) {
    const stimConfig = findConfig(id);

    const protocolsForMode = Object.entries(PROTOCOL_DETAILS)
      .filter(([_, details]) => details.usedBy.includes(newValue))
      .map(([_, details]) => details);

    const updatedStimulus: CurrentInjectionSimulationConfig = {
      ...stimConfig,
      stimulus: {
        ...stimConfig.stimulus,
        stimulusType: newValue,
        stimulusProtocol: protocolsForMode?.[0]?.name || null,
      },
    };

    return update(
      updateArray({
        array: state,
        keyfn: (item) => item.id === id,
        newVal: (item) => Object.assign(item, { ...updatedStimulus }),
      })
    );
  }

  function setProtocol({ id, newValue }: { id: number; newValue: StimulusModule }) {
    const stimConfig = findConfig(id);

    const protocolInfo = PROTOCOL_DETAILS[newValue].name;
    if (!protocolInfo) throw new Error(`Protocol info ${newValue} not found`);

    const updatedStimulus: CurrentInjectionSimulationConfig = {
      ...stimConfig,
      stimulus: {
        ...stimConfig.stimulus,
        stimulusProtocol: protocolInfo,
      },
    };

    return update(
      updateArray({
        array: state,
        keyfn: (item) => item.id === id,
        newVal: (item) => Object.assign(item, { ...updatedStimulus }),
      })
    );
  }

  function setProperty({
    id,
    key,
    newValue,
  }: {
    id: number;
    key: keyof CurrentInjectionSimulationConfig;
    newValue: number | string | null;
  }) {
    const stimConfig = findConfig(id);
    const updatedStimulus = {
      ...stimConfig,
      [key]: newValue,
    };
    return update(
      updateArray({
        array: state,
        keyfn: (item) => item.id === id,
        newVal: (item) => Object.assign(item, { ...updatedStimulus }),
      })
    );
  }

  function setAmplitudes({ id, newValue }: { id: number; newValue: Array<number> | number }) {
    const stimConfig = findConfig(id);

    const updatedStimulus: CurrentInjectionSimulationConfig = {
      ...stimConfig,
      stimulus: {
        ...stimConfig.stimulus,
        amplitudes: newValue,
      },
    };

    return update(
      updateArray({
        array: state,
        keyfn: (item) => item.id === id,
        newVal: (item) => Object.assign(item, { ...updatedStimulus }),
      })
    );
  }

  function add() {
    update([
      ...state,
      {
        ...DEFAULT_CURRENT_INJECTION_CONFIG,
        configId: crypto.randomUUID(),
        id: state.length,
      },
    ]);
  }

  function remove(id: number) {
    update(state.filter((s, index) => index !== id));
  }

  function reset() {
    update([DEFAULT_CURRENT_INJECTION_CONFIG]);
  }

  function empty() {
    update([]);
  }

  return {
    state,
    setMode,
    setProtocol,
    setProperty,
    setAmplitudes,
    reset,
    remove,
    add,
    empty,
  };
}
