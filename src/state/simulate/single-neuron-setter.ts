'use client';

import { atom } from 'jotai';
import { Layout, ToImgopts } from 'plotly.js-dist-min';
import throttle from 'lodash/throttle';

import {
  genericSingleNeuronSimulationPlotDataAtom,
  simulateStepTrackerAtom,
  simulationStatusAtom,
  stimulusPreviewPlotDataAtom,
} from './single-neuron';
import { directCurrentInjectionSimulationConfigAtom } from './categories/direct-current-injection-simulation';
import { synaptomeSimulationConfigAtom } from './categories/synaptome-simulation-config';
import { recordingSourceForSimulationAtom } from './categories/recording-source-for-simulation';
import {
  EntityCreation,
  SingleNeuronSimulation,
  SingleNeuronSimulationResource,
  SynaptomeSimulation,
} from '@/types/nexus';
import {
  createFile,
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
import { runSynaptomeSimulation, runSingleNeuronSimulation } from '@/api/bluenaas';
import { SimulationType } from '@/types/simulation/common';
import { isJSON } from '@/util/utils';
import { getSession } from '@/authFetch';
import { SimulationPlotResponse } from '@/types/simulation/graph';
import getBlobFromPlotImage from '@/util/convert-base64-to_blob';

const PlotImageOptions: ToImgopts = { format: 'png', width: 700, height: 350 };

const makePlotLayout = ({
  title,
  xTitle = 'Time [ms]',
  yTitle = 'Current [nA]',
}: {
  title: string;
  xTitle?: string;
  yTitle?: string;
}): Partial<Layout> => {
  return {
    title: {
      text: title,
      font: { color: '#003A8C', size: 24 },
      x: 0.001,
      xref: 'paper',
      yref: 'paper',
      pad: { l: 0, r: 0, t: 20, b: 40 },
      // @ts-ignore
      automargin: true,
    },
    plot_bgcolor: '#fff',
    paper_bgcolor: '#fff',
    xaxis: {
      automargin: true,
      color: '#003A8C',
      zeroline: false,
      showline: true,
      linecolor: '#888888',
      title: { text: xTitle, font: { size: 12 }, standoff: 6 },
    },
    yaxis: {
      automargin: true,
      color: '#003A8C',
      zeroline: false,
      showline: true,
      linecolor: '#888888',
      title: { text: yTitle, font: { size: 12 }, standoff: 6 },
    },
    showlegend: true,
    margin: { t: 20, r: 20, b: 20, l: 20 },
  };
};

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

  const directStimulation = get(directCurrentInjectionSimulationConfigAtom);
  const recordFrom = get(recordingSourceForSimulationAtom);
  const simulationResult = get(genericSingleNeuronSimulationPlotDataAtom);
  const stimulusResults = get(stimulusPreviewPlotDataAtom);
  const synaptomeConfig = get(synaptomeSimulationConfigAtom);

  const singleNeuronId = getIdFromSelfUrl(modelSelfUrl);

  if (!directStimulation || !simulationResult || !singleNeuronId) return null;

  // TODO: Remove `singleNeuronSimulationConfig` and use `simulationConfig` directly once backend is updated to accept this type
  const singleNeuronSimulationConfig: SingleNeuronModelSimulationConfig = {
    recordFrom,
    celsius: directStimulation![0].celsius,
    hypamp: directStimulation![0].hypamp,
    vinit: directStimulation![0].vinit,
    injectTo: directStimulation![0].injectTo,
    stimulus: directStimulation![0].stimulus,
    synaptome: simulationType === 'synaptome-simulation' ? synaptomeConfig : undefined,
  };

  const Plotly = await import('plotly.js-dist-min');
  const stimulusImagesMetadata = await Promise.all(
    stimulusResults.map(({ data, id }) => {
      const url = composeUrl('file', '', { project: projectId, org: vLabId });
      return Plotly.toImage(
        { data, layout: makePlotLayout({ title: 'Stimulus' }) },
        PlotImageOptions
      )
        .then((image) => getBlobFromPlotImage(image))
        .then((blob) =>
          createFile(blob, `${STIMULUS_PLOT_NAME}-${id}.png`, 'image/png', session, url)
        );
    })
  );

  const simulationPlotUrl = composeUrl('file', '', { project: projectId, org: vLabId });
  const simulationImageMetadata = await Plotly.toImage(
    { data: simulationResult, layout: makePlotLayout({ title: 'Recording' }) },
    PlotImageOptions
  )
    .then((image) => getBlobFromPlotImage(image))
    .then((blob) =>
      createFile(blob, `${SIMULATION_PLOT_NAME}.png`, 'image/png', session, simulationPlotUrl)
    );

  const resource = await fetchResourceById<EModel | MEModel>(singleNeuronId, session);

  if (!resource) return null;

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
      createDistribution(
        simulationImageMetadata,
        composeUrl('file', simulationImageMetadata['@id'], {
          rev: simulationImageMetadata._rev,
          org: vLabId,
          project: projectId,
        })
      ),
      ...stimulusImagesMetadata.map((dist) =>
        createDistribution(
          dist,
          composeUrl('file', dist['@id'], {
            rev: dist._rev,
            org: vLabId,
            project: projectId,
          })
        )
      ),
    ],
    used: {
      '@type': 'MEModel',
      '@id': singleNeuronId,
    },
    injectionLocation: singleNeuronSimulationConfig.injectTo,
    recordingLocation: singleNeuronSimulationConfig.recordFrom.map(
      (r) => `${r.section}_${r.segmentOffset}` // TODO: recordingLocation is not needed in the entity since it is present in the distribution and the enity schema does not allow saving correct format for record location
    ),
    brainLocation: resource.brainLocation,
  };

  if (simulationType === 'single-neuron-simulation') {
    entity = {
      ...commonProperties,
      '@type': ['Entity', 'SingleNeuronSimulation'],
    } as EntityCreation<SingleNeuronSimulation>;
  } else if (simulationType === 'synaptome-simulation') {
    entity = {
      ...commonProperties,
      '@type': ['Entity', 'SynaptomeSimulation'],
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
    set(genericSingleNeuronSimulationPlotDataAtom, initialPlotData);
    const onTraceData = throttle((data: TraceData) => {
      const updatedPlotData: PlotData = data.map((entry) => ({
        x: entry.t,
        y: entry.v,
        type: 'scatter',
        name: entry.label,
      }));
      set(genericSingleNeuronSimulationPlotDataAtom, updatedPlotData);
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
