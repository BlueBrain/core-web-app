import { atom, useAtom } from 'jotai';

import { getParamValues } from '@/util/simulate/single-neuron';
import updateArray from '@/util/updateArray';
import {
  StimulusModuleOption,
  DirectCurrentInjectionSimulationConfig,
  StimulusType,
  StimulusModule,
  StimulusParameter,
} from '@/types/simulation/single-neuron';
import {
  DEFAULT_DIRECT_STIM_CONFIG,
  stimulusModuleParams,
  stimulusParams,
} from '@/constants/simulate/single-neuron';

export const directCurrentInjectionSimulationConfigAtom = atom<
  Array<DirectCurrentInjectionSimulationConfig>
>([DEFAULT_DIRECT_STIM_CONFIG]);
directCurrentInjectionSimulationConfigAtom.debugLabel =
  'directCurrentInjectionSimulationConfigAtom';

export default function useDirectCurrentInjectionSimulationConfig() {
  const [state, update] = useAtom(directCurrentInjectionSimulationConfigAtom);

  function findConfig(id: number) {
    const stimConfig = state.find(
      (config: DirectCurrentInjectionSimulationConfig) => config.id === id
    );
    if (!stimConfig) {
      throw new Error(`No stimulation config for id ${id} exists`);
    }
    return stimConfig;
  }

  function setMode({ id, newValue }: { id: number; newValue: StimulusType }) {
    const stimConfig = findConfig(id);

    const options = stimulusModuleParams.options.filter((option) =>
      option.usedBy.includes(newValue)
    );
    const paramInfo = stimulusParams[options?.[0]?.value] || {};

    const updatedStimulus = {
      ...stimConfig.stimulus,
      stimulusType: state,
      stimulusProtocolOptions: options || [],
      stimulusProtocolInfo: options?.[0] || null,
      stimulusProtocol: options?.[0]?.value || null,
      paramValues: getParamValues(paramInfo),
      paramInfo,
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

    const protocolInfo = stimulusModuleParams.options.find(
      (option: StimulusModuleOption) => option.value === newValue
    );
    if (!protocolInfo) throw new Error(`Protocol info ${newValue} not found`);

    const paramInfo = stimulusParams[newValue];
    if (!paramInfo) throw new Error(`Parameters for protocol ${newValue} not found`);
    paramInfo.stop_time.defaultValue = protocolInfo.duration;

    const updatedStimulus = {
      ...stimConfig.stimulus,
      stimulusProtocolInfo: protocolInfo || null,
      stimulusProtocol: protocolInfo?.value || null,
      paramValues: getParamValues(paramInfo),
      paramInfo,
    };

    return update(
      updateArray({
        array: state,
        keyfn: (item) => item.id === id,
        newVal: (item) => Object.assign(item, { ...updatedStimulus }),
      })
    );
  }

  function setParamValue({
    id,
    key,
    newValue,
  }: {
    id: number;
    key: keyof StimulusParameter;
    newValue: number | null;
  }) {
    const stimConfig = findConfig(id);

    const updatedStimulus = {
      ...stimConfig.stimulus,
      paramValues: {
        ...stimConfig.stimulus.paramValues,
        [key]: newValue,
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
    key: keyof DirectCurrentInjectionSimulationConfig;
    newValue: number | null;
  }) {
    const stimConfig = findConfig(id);
    const updatedStimulus = {
      ...stimConfig.stimulus,
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

  function setAmplitudes({ id, newValue }: { id: number; newValue: Array<number> }) {
    const stimConfig = findConfig(id);

    const updatedStimulus = {
      ...stimConfig.stimulus,
      amplitudes: newValue,
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
        ...DEFAULT_DIRECT_STIM_CONFIG,
        configId: crypto.randomUUID(),
        id: state.length,
      },
    ]);
  }

  function remove(id: number) {
    update(state.filter((s, index) => index !== id));
  }

  function reset() {
    update([DEFAULT_DIRECT_STIM_CONFIG]);
  }

  return {
    state,
    setMode,
    setProtocol,
    setProperty,
    setParamValue,
    setAmplitudes,
    reset,
    remove,
    add,
  };
}
