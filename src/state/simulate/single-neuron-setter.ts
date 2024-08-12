import { atom } from 'jotai';
import throttle from 'lodash/throttle';

import {
  simulateStepTrackerAtom,
  simulationPlotDataAtom,
  simulationStatusAtom,
} from './single-neuron';
import { directCurrentInjectionSimulationConfigAtom } from './categories/direct-current-injection-simulation';
import { synaptomeSimulationConfigAtom } from './categories/synaptome-simulation-config';
import { recordingSourceForSimulationAtom } from './categories/recording-source-for-simulation';
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
  SingleNeuronModelSimulationConfig,
  SingleNeuronSimulationPayload,
} from '@/types/simulation/single-neuron';
import { runSynaptomeSimulation, runSingleNeuronSimulation } from '@/api/bluenaas';
import { SimulationType } from '@/types/simulation/common';
import { isJSON } from '@/util/utils';
import { getSession } from '@/authFetch';
import { SimulationPlotResponse } from '@/types/simulation/graph';

export const createSingleNeuronSimulationAtom = atom<
  null,
  [string, string, string, string, string],
  Promise<SingleNeuronSimulationResource | null>
>(null, async (get, set, name, description, modelSelfUrl, vLabId, projectId) => {
  const session = get(sessionAtom);
  const directStimulation = get(directCurrentInjectionSimulationConfigAtom);
  const recordFrom = get(recordingSourceForSimulationAtom);
  const simulationResults = get(simulationPlotDataAtom);
  const singleNeuronId = getIdFromSelfUrl(modelSelfUrl);

  if (!session || !directStimulation || !simulationResults || !singleNeuronId) return null;

  // TODO: Remove `singleNeuronSimulationConfig` and use `simulationConfig` directly once backend is updated to accept this type
  const singleNeuronSimulationConfig: SingleNeuronModelSimulationConfig = {
    recordFrom,
    celsius: directStimulation![0].celsius,
    hypamp: directStimulation![0].hypamp,
    vinit: directStimulation![0].vinit,
    injectTo: directStimulation![0].injectTo,
    stimulus: directStimulation![0].stimulus,
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

export const launchSimulationAtom = atom<null, [string, SimulationType], void>(
  null,
  async (get, set, modelSelfUrl: string, simulationType: SimulationType) => {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error('Session token should be valid');
    }
    const directStimulation = get(directCurrentInjectionSimulationConfigAtom);
    const synapses = get(synaptomeSimulationConfigAtom);
    const recordFrom = get(recordingSourceForSimulationAtom);

    if (simulationType === 'single-neuron-simulation') {
      if (!directStimulation) {
        throw new Error(
          'Cannot run simulation without valid configuration for direct current injection'
        );
      }
    } else if (simulationType === 'synaptome-simulation') {
      if (!directStimulation || !directStimulation.length) {
        throw new Error(
          'Cannot run simulation without valid configuration for direct current injection'
        );
      }
      if (!synapses || !synapses.length) {
        throw new Error('Cannot run simulation without valid configuration for synapses');
      }
    }

    set(simulationStatusAtom, { status: 'launched' });
    set(simulateStepTrackerAtom, {
      steps: get(simulateStepTrackerAtom).steps,
      current: { title: 'results' },
    });
    const initialPlotData: PlotData = [
      {
        x: [0],
        y: [0],
        type: 'scatter',
        name: '',
      },
    ];
    set(simulationPlotDataAtom, initialPlotData);
    const onTraceData = throttle((data: TraceData) => {
      const updatedPlotData: PlotData = data.map((entry) => ({
        x: entry.t,
        y: entry.v,
        type: 'scatter',
        name: entry.label,
      }));
      set(simulationPlotDataAtom, updatedPlotData);
    }, 100);

    try {
      const partialSimData =
        simulationType === 'synaptome-simulation' && synapses
          ? await runSynaptomeSimulation(
              modelSelfUrl,
              session?.accessToken,
              {
                ...directStimulation[0],
                recordFrom,
              },
              synapses
            )
          : await runSingleNeuronSimulation(modelSelfUrl, session?.accessToken!, {
              ...directStimulation[0],
              recordFrom,
            });

      if (!partialSimData.ok) {
        const error = await partialSimData.json();
        set(simulationStatusAtom, {
          status: 'error',
          description: JSON.stringify(error),
        });
        set(simulateStepTrackerAtom, {
          steps: get(simulateStepTrackerAtom).steps,
          current: { title: 'stimulation' },
        });
        return;
      }

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
            const partialData: SimulationPlotResponse = JSON.parse(data);
            traceData.push({ t: partialData.t, v: partialData.v, label: partialData.name });
            onTraceData(traceData);
            data = '';
          }
        }
        set(simulationStatusAtom, { status: 'finished' });
      }
    } catch (error) {
      set(simulationStatusAtom, { status: 'error', description: JSON.stringify(error) });
      set(simulateStepTrackerAtom, {
        steps: get(simulateStepTrackerAtom).steps,
        current: { title: 'stimulation' },
      });
    }
  }
);
