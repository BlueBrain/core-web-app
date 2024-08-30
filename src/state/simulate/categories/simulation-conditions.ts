import { atom, useAtom } from 'jotai';

import { SimulationExperimentalSetup } from '@/types/simulation/single-neuron';
import { DEFAULT_SIMULATION_EXPERIMENTAL_SETUP } from '@/constants/simulate/single-neuron';

export const simulationExperimentalSetupAtom = atom<SimulationExperimentalSetup>(
  DEFAULT_SIMULATION_EXPERIMENTAL_SETUP
);

simulationExperimentalSetupAtom.debugLabel = 'simulationConditionsAtom';

export default function useSimulationConditions() {
  const [state, update] = useAtom(simulationExperimentalSetupAtom);

  function setProperty({
    key,
    newValue,
  }: {
    key: keyof SimulationExperimentalSetup;
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
