'use client';

import { atom } from 'jotai';

import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import pick from 'lodash/pick';
import values from 'lodash/values';


import {
  genericSingleNeuronSimulationPlotDataAtom,
  simulateStepTrackerAtom,
  simulationStatusAtom,
  stimulusPreviewPlotDataAtom,
} from './single-neuron';
import { simulationConditionsAtom } from './categories/simulation-conditions';
import { currentInjectionSimulationConfigAtom } from './categories/current-injection-simulation';
import { synaptomeSimulationConfigAtom } from './categories/synaptome-simulation-config';
import { recordingSourceForSimulationAtom } from './categories/recording-source-for-simulation';
import {
  EntityCreation,
  SingleNeuronSimulation,
  SingleNeuronSimulationResource,
  SynaptomeSimulation,
} from '@/types/nexus';
import {
  createJsonFileOnVlabProject,
  createResource,
  fetchResourceById,
} from '@/api/nexus';
import { composeUrl, createDistribution, getIdFromSelfUrl } from '@/util/nexus';
import { PlotData, TraceData } from '@/services/bluenaas-single-cell/types';
import { EModel } from '@/types/e-model';
import { MEModel } from '@/types/me-model';
import {
  SingleNeuronModelSimulationConfig,
  SimulationPayload,
} from '@/types/simulation/single-neuron';
import { SimulationType } from '@/types/simulation/common';
import { isJSON } from '@/util/utils';
import { getSession } from '@/authFetch';
import { SimulationPlotResponse } from '@/types/simulation/graph';
import { nexus } from '@/config';
import { runGenericSingleNeuronSimulation } from '@/api/bluenaas/runSimulation';



export const SIMULATION_CONFIG_FILE_NAME_BASE = 'simulation-config';
export const STIMULUS_PLOT_NAME = 'stimulus-plot';
export const SIMULATION_PLOT_NAME = 'simulation-plot';

export const createSingleNeuronSimulationAtom = atom<
  null,
  [string, string, string, string, string, SimulationType],
  Promise<SingleNeuronSimulationResource | null>
>(null, async (get, set, name, description, modelSelfUrl, vLabId, projectId, simulationType) => {
  const session = await getSession();
  if (!session) {
    throw new Error('No valid session found');
  }

  const recordFromConfig = get(recordingSourceForSimulationAtom);
  const conditionsConfig = get(simulationConditionsAtom);
  const currentInjectionConfig = get(currentInjectionSimulationConfigAtom);
  const synaptomeConfig = get(synaptomeSimulationConfigAtom);
  const simulationResult = get(genericSingleNeuronSimulationPlotDataAtom);
  const stimulusResults = get(stimulusPreviewPlotDataAtom);

  const singleNeuronId = getIdFromSelfUrl(modelSelfUrl);

  if (!simulationResult || !singleNeuronId) return null;

  const recordFromUniq = uniqBy(recordFromConfig, (item) => values(pick(item, ["section", "offset"])).map(String).join());
  // TODO: Remove `singleNeuronSimulationConfig` and use `simulationConfig` directly once backend is updated to accept this type
  const singleNeuronSimulationConfig: SingleNeuronModelSimulationConfig = {
    recordFrom: recordFromUniq,
    conditions: conditionsConfig,
    currentInjection: currentInjectionConfig[0],
    synaptome: simulationType === 'synaptome-simulation' ? synaptomeConfig : undefined,
  };


  const resource = await fetchResourceById<EModel | MEModel>(singleNeuronId, session,
    singleNeuronId.startsWith(nexus.defaultIdBaseUrl) ? {} : { org: vLabId, project: projectId }
  );

  if (!resource || resource['@context'] === 'https://bluebrain.github.io/nexus/contexts/error.json') {
    throw new Error("Model not found");
  }

  const payload: SimulationPayload = {
    simulation: simulationResult,
    stimulus: stimulusResults,
    config: singleNeuronSimulationConfig,
  };

  const simulationConfigFile = await createJsonFileOnVlabProject(
    payload,
    simulationType === 'single-neuron-simulation'
      ? `${SIMULATION_CONFIG_FILE_NAME_BASE}-single-neuron.json`
      : `${SIMULATION_CONFIG_FILE_NAME_BASE}-synaptome.json`,
    session,
    vLabId,
    projectId
  );

  let entity: EntityCreation<SingleNeuronSimulation> | EntityCreation<SynaptomeSimulation> | null =
    null;

  const commonProperties = {
    name,
    description,
    '@context': 'https://bbp.neuroshapes.org',
    distribution: [
      createDistribution(
        simulationConfigFile,
        composeUrl('file', simulationConfigFile['@id'], {
          rev: simulationConfigFile._rev,
          org: vLabId,
          project: projectId,
        })
      ),
    ],
    injectionLocation: singleNeuronSimulationConfig.currentInjection.injectTo,
    recordingLocation: singleNeuronSimulationConfig.recordFrom.map(
      (r) => `${r.section}_${r.offset}` // TODO: recordingLocation is not needed in the entity since it is present in the distribution and the enity schema does not allow saving correct format for record location
    ),
    brainLocation: resource.brainLocation,
  };

  if (simulationType === 'single-neuron-simulation') {
    entity = {
      ...commonProperties,
      '@type': ['Entity', 'SingleNeuronSimulation'],
      "used": {
        '@type': 'MEModel',
        '@id': singleNeuronId,
      },
    } as EntityCreation<SingleNeuronSimulation>;
  } else if (simulationType === 'synaptome-simulation') {
    entity = {
      ...commonProperties,
      "@type": ['Entity', 'SynaptomeSimulation'],
      "used": {
        "@id": resource['@id'],
        "@type": resource['@type'],
      }
    } as EntityCreation<SynaptomeSimulation>;
  }

  const resourceUrl = composeUrl('resource', '', {
    sync: true,
    schema: null,
    project: projectId,
    org: vLabId,
  });
  if (entity) {
    return createResource<SingleNeuronSimulationResource>(entity, session, resourceUrl);
  }
  return null;
});

export const launchSimulationAtom = atom<null, [string, SimulationType], void>(
  null,
  async (get, set, modelSelfUrl: string, simulationType: SimulationType) => {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error('Session token should be valid');
    }
    const currentInjectionConfig = get(currentInjectionSimulationConfigAtom);
    const synapsesConfig = get(synaptomeSimulationConfigAtom);
    const recordFromConfig = get(recordingSourceForSimulationAtom);
    const conditionsConfig = get(simulationConditionsAtom);

    if (simulationType === 'single-neuron-simulation') {
      if (!currentInjectionConfig) {
        throw new Error(
          'Cannot run simulation without valid configuration for current injection'
        );
      }
    } else if (simulationType === 'synaptome-simulation') {
      if ((!currentInjectionConfig || !currentInjectionConfig.length) && (!synapsesConfig || !synapsesConfig.length)) {
        throw new Error(
          'Cannot run simulation without valid configuration'
        );
      }
    }

    set(simulationStatusAtom, { status: 'launched' });
    set(simulateStepTrackerAtom, {
      steps: get(simulateStepTrackerAtom).steps,
      current: { title: "Results" },
    });

    const initialPlotData: Record<string, PlotData> = {}
    recordFromConfig.forEach(o => {
      const key = `${o.section}_${o.offset}`;
      initialPlotData[key] = [
        {
          x: [0],
          y: [0],
          type: 'scatter',
          name: '',
        },
      ]
    });

    set(genericSingleNeuronSimulationPlotDataAtom, initialPlotData);

    const onTraceData = (data: TraceData) => {
      const updatedPlotData: PlotData = data.map((entry) => ({
        x: entry.t,
        y: entry.v,
        type: 'scatter',
        name: entry.label,
        recording: entry.recording
      }));
      const groupedRecording = groupBy(updatedPlotData, (p) => p.recording);
      set(genericSingleNeuronSimulationPlotDataAtom, groupedRecording);
    }

    const recordFromUniq = uniqBy(recordFromConfig, (item) => values(pick(item, ["section", "offset"])).map(String).join());

    try {
      const response = await runGenericSingleNeuronSimulation(
        {
          modelUrl: modelSelfUrl,
          token: session.accessToken,
          config: {
            recordFrom: recordFromUniq,
            conditions: conditionsConfig,
            currentInjection: currentInjectionConfig.length > 0 ? currentInjectionConfig[0] : undefined,
            synapses: simulationType === "synaptome-simulation" ? synapsesConfig : undefined,
            type: simulationType
          }
        }
      )



      if (!response.ok) {
        const error = await response.json();
        set(simulationStatusAtom, {
          status: 'error',
          description: JSON.stringify(error),
        });
        set(simulateStepTrackerAtom, {
          steps: get(simulateStepTrackerAtom).steps,
          current: { title: "Experimental setup" },
        });
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      if (reader) {
        let plotData: PlotData = [];
        let data = "";
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const decodedValue = decoder.decode(value, { stream: true });
          data += decodedValue;
        }
        const result = data.split('\n').filter((o) => isJSON(o)).map(o => JSON.parse(o) as SimulationPlotResponse)

        if (isJSON(JSON.stringify(result))) {
          plotData = result.map((p) => ({
            x: p.t,
            y: p.v,
            type: 'scatter',
            name: p.stimulus_name,
            recording: p.recording_name,
          }))
          const groupedRecording = groupBy(plotData, (p) => p.recording);
          set(genericSingleNeuronSimulationPlotDataAtom, groupedRecording);
          set(simulationStatusAtom, { status: 'finished' });
          return;
        }
        set(simulationStatusAtom, { status: 'error', description: "Parsing plot data failed" });
      }
    } catch (error) {
      set(simulationStatusAtom, { status: 'error', description: JSON.stringify(error) });
      set(simulateStepTrackerAtom, {
        steps: get(simulateStepTrackerAtom).steps,
        current: { title: "Experimental setup" },
      });
    }
  }
);
