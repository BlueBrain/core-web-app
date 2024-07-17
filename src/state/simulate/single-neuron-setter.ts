import { atom } from 'jotai';

import {
  blueNaasInstanceRefAtom,
  simulateStepAtom,
  simulationConfigAtom,
  simulationPlotDataAtom,
  simulationStatusAtom,
  singleNeuronIdAtom,
} from './single-neuron';
import {
  EntityCreation,
  SingleNeuronSimulation,
  SingleNeuronSimulationResource,
} from '@/types/nexus';
import sessionAtom from '@/state/session';
import { createJsonFile, createResource, fetchResourceById } from '@/api/nexus';
import { createDistribution } from '@/util/nexus';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import { EModel } from '@/types/e-model';
import { MEModel } from '@/types/me-model';
import {
  SingleModelSimulationConfig,
  SingleNeuronSimulationPayload,
} from '@/types/simulate/single-neuron';

export const createSingleNeuronSimulationAtom = atom<
  null,
  [string, string],
  Promise<SingleNeuronSimulationResource | null>
>(null, async (get, set, name, description) => {
  const session = get(sessionAtom);
  const simulationConfig = get(simulationConfigAtom);
  const simulationResults = get(simulationPlotDataAtom);
  const singleNeuronId = get(singleNeuronIdAtom);

  if (!session || !simulationConfig || !simulationResults || !singleNeuronId) return null;

  // TODO: Remove `singleNeuronSimulationConfig` and use `simulationConfig` directly once backend is updated to accept this type
  const singleNeuronSimulationConfig: SingleModelSimulationConfig = {
    recordFrom: [...simulationConfig.recordFrom],
    celsius: simulationConfig.directStimulation![0].celsius,
    hypamp: simulationConfig.directStimulation![0].hypamp,
    vinit: simulationConfig.directStimulation![0].vinit,
    injectTo: simulationConfig.directStimulation![0].injectTo,
    stimulus: simulationConfig.directStimulation![0].stimulus,
  };

  const resource = await fetchResourceById<EModel | MEModel>(singleNeuronId, session);

  if (!resource) return null;

  const payload: SingleNeuronSimulationPayload = {
    config: singleNeuronSimulationConfig,
    simulationResult: simulationResults,
    stimuliPreviewData: [], // TODO: make an atom of preview stimuli to add here
  };

  const file = await createJsonFile(payload, 'single-neuron-simulation.json', session);

  const entity: EntityCreation<SingleNeuronSimulation> = {
    '@type': ['Entity', 'SingleNeuronSimulation'],
    '@context': 'https://bbp.neuroshapes.org',
    distribution: createDistribution(file),
    name,
    description,
    used: {
      '@type': 'MEModel',
      '@id': singleNeuronId,
    },
    injectionLocation: singleNeuronSimulationConfig.injectTo,
    recordingLocation: singleNeuronSimulationConfig.recordFrom,
    brainLocation: resource.brainLocation,
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
