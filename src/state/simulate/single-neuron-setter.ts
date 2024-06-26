import { atom } from 'jotai';

import {
  blueNaasInstanceRefAtom,
  simulateStepAtom,
  simulationConfigAtom,
  simulationPlotDataAtom,
  simulationResultsAtom,
  simulationStatusAtom,
  singleNeuronIdAtom,
} from './single-neuron';
import {
  EntityCreation,
  SingleNeuronSimulation,
  SingleNeuronSimulationResource,
} from '@/types/nexus';
import sessionAtom from '@/state/session';
import { createJsonFile, createResource } from '@/api/nexus';
import { createDistribution } from '@/util/nexus';
import { PlotData } from '@/services/bluenaas-single-cell/types';

export const createSingleNeuronSimulationAtom = atom<
  null,
  [string, string],
  Promise<SingleNeuronSimulationResource | null>
>(null, async (get, set, name, description) => {
  const session = get(sessionAtom);
  const simulationConfig = get(simulationConfigAtom);
  const simulationResults = get(simulationResultsAtom);
  const singleNeuronId = get(singleNeuronIdAtom);

  if (!session || !simulationConfig || !simulationResults || !singleNeuronId) return null;

  const payload = {
    config: simulationConfig,
    results: simulationResults,
  };

  const file = await createJsonFile(payload, 'single-neuron-simulation.json', session);

  const entity: EntityCreation<SingleNeuronSimulation> = {
    '@type': ['Entity', 'SingleNeuronSimulation'],
    '@context': 'https://bbp.neuroshapes.org',
    distribution: createDistribution(file),
    name,
    description,
    used: {
      '@type': 'EModel',
      '@id': singleNeuronId,
    },
  };

  return createResource<SingleNeuronSimulationResource>(entity, session);
});

export const launchSimulationAtom = atom(null, (get, set) => {
  const simulationStatus = get(simulationStatusAtom);
  set(simulationStatusAtom, { ...simulationStatus, launched: true });

  const blueNaasInstanceRef = get(blueNaasInstanceRefAtom);

  if (!blueNaasInstanceRef?.current) {
    throw new Error('No BlueNaaS instance');
  }

  blueNaasInstanceRef.current.runSim();
  set(simulateStepAtom, 'results');
  const initialPlotData: PlotData = [
    {
      x: [0],
      y: [0],
      type: 'scatter',
      name: '',
    },
  ];
  set(simulationPlotDataAtom, initialPlotData);
});

export const simulationDoneAtom = atom(null, (get, set) => {
  const simulationStatus = get(simulationStatusAtom);
  set(simulationStatusAtom, { ...simulationStatus, finished: true });
});

export const setStimulusProtcolsAtom = atom<null, [string], void>(
  null,
  (get, set, protocolName) => {
    const blueNaasInstanceRef = get(blueNaasInstanceRefAtom);

    if (!blueNaasInstanceRef?.current) {
      throw new Error('No BlueNaaS instance');
    }

    blueNaasInstanceRef.current.setStimulusProtocol(protocolName);
  }
);
