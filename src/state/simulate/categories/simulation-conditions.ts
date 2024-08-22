import { atom, useAtom } from 'jotai';

import { SimulationConditions } from '@/types/simulation/single-neuron';
import { DEFAULT_SIMULATION_CONDITIONS } from '@/constants/simulate/single-neuron';

export const simulationConditionsAtom = atom<SimulationConditions>(DEFAULT_SIMULATION_CONDITIONS);

simulationConditionsAtom.debugLabel = 'simulationConditionsAtom';

export default function useSimulationConditions() {
  const [state, update] = useAtom(simulationConditionsAtom);

  function setProperty({
    key,
    newValue,
  }: {
    key: keyof SimulationConditions;
    newValue: number | null;
  }) {
    return update({
      ...state,
      [key]: newValue,
    });
  }

  return {
    state,
    setProperty,
  };
}
