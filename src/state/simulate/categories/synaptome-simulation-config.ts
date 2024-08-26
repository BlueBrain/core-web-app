import { atom, useAtom } from 'jotai';
import { getDefaultSynapseConfig } from '@/constants/simulate/single-neuron';
import { SynapseConfig, UpdateSynapseSimulationProperty } from '@/types/simulation/single-neuron';
import updateArray from '@/util/updateArray';
import { SingleSynaptomeConfig } from '@/types/synaptome';

export const synaptomeSimulationConfigAtom = atom<Array<SynapseConfig>>([]);
synaptomeSimulationConfigAtom.debugLabel = 'synaptomeSimulationConfigAtom';

export default function useSynaptomeSimulationConfig() {
  const [state, update] = useAtom(synaptomeSimulationConfigAtom);

  function findConfig(key: number) {
    const synapseConfig = state.find((config: SynapseConfig) => config.key === key);
    if (!synapseConfig) {
      throw new Error(`No Synapse Config for id ${key} exists`);
    }
    return synapseConfig;
  }

  function reset(config: Array<SingleSynaptomeConfig>) {
    const defaultSynapseConfig = getDefaultSynapseConfig(config);
    if (defaultSynapseConfig) {
      update([
        {
          ...defaultSynapseConfig,
          key: state.length,
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
          key: state.length,
        },
      ]);
    }
  }

  function remove(key: number) {
    update(state.filter((s, index) => index !== key) ?? []);
  }

  function empty() {
    update([]);
  }

  function setProperty({ id, key, newValue }: UpdateSynapseSimulationProperty) {
    const config = findConfig(id);
    const updateConfig = {
      ...config,
      [key]: newValue,
    };
    return update(
      updateArray({
        array: state,
        keyfn: (item) => item.key === id,
        newVal: (item) => Object.assign(item, { ...updateConfig }),
      })
    );
  }

  return {
    state,
    findConfig,
    newConfig,
    remove,
    setProperty,
    reset,
    empty,
  };
}
