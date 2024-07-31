import { atom } from 'jotai';
import throttle from 'lodash/throttle';

import {
  simulateStepAtom,
  simulationConfigAtom,
  simulationPlotDataAtom,
  simulationStatusAtom,
} from './single-neuron';
import {
  EntityCreation,
  SingleNeuronSimulation,
  SingleNeuronSimulationResource,
} from '@/types/nexus';
import sessionAtom from '@/state/session';
import { createJsonFileOnVlabProject, createResource, fetchResourceById } from '@/api/nexus';
import { composeUrl, createDistribution, getIdFromSelfUrl } from '@/util/nexus';
import { PlotData, TraceData } from '@/services/bluenaas-single-cell/types';
import { EModel } from '@/types/e-model';
import { MEModel } from '@/types/me-model';
import {
  ResponsePlotData,
  SingleModelSimulationConfig,
  SingleNeuronSimulationPayload,
} from '@/types/simulate/single-neuron';
import { runSimulation } from '@/api/simulation/single-neuron';

export const createSingleNeuronSimulationAtom = atom<
  null,
  [string, string, string, string, string],
  Promise<SingleNeuronSimulationResource | null>
>(null, async (get, set, name, description, modelSelfUrl, vLabId, projectId) => {
  const session = get(sessionAtom);
  const simulationConfig = get(simulationConfigAtom);
  const simulationResults = get(simulationPlotDataAtom);
  const singleNeuronId = getIdFromSelfUrl(modelSelfUrl);

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

  const file = await createJsonFileOnVlabProject(
    payload,
    'single-neuron-simulation.json',
    session,
    vLabId,
    projectId
  );

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

  const resourceUrl = composeUrl('resource', '', {
    sync: true,
    schema: null,
    project: projectId,
    org: vLabId,
  });
  return createResource<SingleNeuronSimulationResource>(entity, session, resourceUrl);
});

function isJSON(str: any) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export const launchSimulationAtom = atom<null, [string], void>(
  null,
  async (get, set, model_self_url: string) => {
    const session = get(sessionAtom);
    if (!session?.accessToken) {
      throw new Error('Session token should be valid');
    }
    const simulationConfig = get(simulationConfigAtom);

    if (!simulationConfig.directStimulation) {
      throw new Error(
        'Cannot run simulation without valid configuration for direct current injection'
      );
    }

    const simulationStatus = get(simulationStatusAtom);
    set(simulationStatusAtom, { ...simulationStatus, launched: true });
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

    const partialSimData = await runSimulation(model_self_url, session?.accessToken!, {
      ...simulationConfig.directStimulation[0],
      recordFrom: simulationConfig.recordFrom,
    });

    const onTraceData = throttle((data: TraceData) => {
      const updatedPlotData: PlotData = data.map((entry) => ({
        x: entry.t,
        y: entry.v,
        type: 'scatter',
        name: entry.label,
      }));
      set(simulationPlotDataAtom, updatedPlotData);
    }, 100);

    const reader = partialSimData.body?.getReader();
    let data: string = '';
    const traceData: TraceData = [];
    let value: Uint8Array | undefined;
    let done: boolean = false;
    const decoder = new TextDecoder();

    if (reader) {
      while (!done) {
        ({ done, value } = await reader.read());
        const decodedChunk = decoder.decode(value, { stream: true });
        data += decodedChunk;
        if (isJSON(data)) {
          const partialData: ResponsePlotData = JSON.parse(data);
          traceData.push({ t: partialData.t, v: partialData.v, label: partialData.name });
          onTraceData(traceData);
          data = '';
        }
      }
      set(simulationDoneAtom);
    }
  }
);

export const simulationDoneAtom = atom(null, (get, set) => {
  const simulationStatus = get(simulationStatusAtom);
  set(simulationStatusAtom, { ...simulationStatus, finished: true });
});
