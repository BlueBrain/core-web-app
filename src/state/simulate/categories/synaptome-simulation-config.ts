import { atom, useAtom } from 'jotai';

import { getDefaultSynapseConfig } from '@/constants/simulate/single-neuron';
import { SynapseConfig } from '@/types/simulation/single-neuron';
import updateArray from '@/util/updateArray';
import { SingleSynaptomeConfig } from '@/types/synaptome';

export const synaptomeSimulationConfigAtom = atom<Array<SynapseConfig>>([]);
synaptomeSimulationConfigAtom.debugLabel = 'synaptomeSimulationConfigAtom';

export default function useSynaptomeSimulationConfig() {
  const [state, update] = useAtom(synaptomeSimulationConfigAtom);

  function findConfig(id: string) {
    const synapseConfig = state.find((config: SynapseConfig) => config.id === id);
    if (!synapseConfig) {
      throw new Error(`No Synapse Config for id ${id} exists`);
    }
    return synapseConfig;
  }

  function reset(config: Array<SingleSynaptomeConfig>) {
    const defaultSynapseConfig = getDefaultSynapseConfig(config);
    if (defaultSynapseConfig) {
      update([
        {
          ...defaultSynapseConfig,
          id: `${state.length}`,
        },
      ]);
    }
  }

  function newConfig(config: Array<SingleSynaptomeConfig>) {
    const defaultSynapseConfig = getDefaultSynapseConfig(config);
    if (defaultSynapseConfig) {
      update([
        ...(state || []),
        {
          ...defaultSynapseConfig,
          id: `${state.length}`,
        },
      ]);
    }
  }

  function remove(id: number) {
    update(state.filter((s, index) => index !== id) ?? []);
  }

  function setProperty({
    id,
    key,
    newValue,
  }: {
    id: string;
    key: keyof SynapseConfig;
    newValue: number;
  }) {
    const config = findConfig(id);
    const updateConfig = {
      ...config,
      [key]: newValue,
    };
    return update(
      updateArray({
        array: state,
        keyfn: (item) => item.id === id,
        newVal: (item) => Object.assign(item, { ...updateConfig }),
      })
    );
  }

  return {
    state,
    newConfig,
    remove,
    setProperty,
    reset,
  };
}
