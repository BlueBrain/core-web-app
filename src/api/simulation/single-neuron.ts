import { blueNaasUrl } from '@/config';
import {
  RunSimulationRequestBody,
  StimuliPlotRequest,
  StimuliPlotResponse,
  SynapsesConfig,
} from '@/types/simulate/single-neuron';

export const runSimulation = async (
  modelSelfUrl: string,
  token: string,
  config: RunSimulationRequestBody
) => {
  return await fetch(`${blueNaasUrl}/simulation/run?model_id=${encodeURIComponent(modelSelfUrl)}`, {
    method: 'post',
    headers: {
      accept: 'application/x-ndjson',
      authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...config,
      stimulus: {
        stimulusType: config.stimulus.stimulusType,
        stimulusProtocol: config.stimulus.stimulusProtocol,
        paramValues: { ...config.stimulus.paramValues },
        amplitudes: config.stimulus.amplitudes,
      },
    }),
  });
};

export const runSynapseSimulation = async (
  synaptomeModelSelf: string,
  token: string,
  directCurrentConfig: RunSimulationRequestBody,
  synapseConfigs: SynapsesConfig
) => {
  return await fetch(
    `${blueNaasUrl}/simulation/synapse/run?model_id=${encodeURIComponent(synaptomeModelSelf)}`,
    {
      method: 'post',
      headers: {
        accept: 'application/x-ndjson',
        authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        directCurrentConfig,
        synapseConfigs: synapseConfigs.map((s) => ({ ...s, id: s.synapseId })),
      }),
    }
  );
};

export const getStimuliPlot = async (
  modelSelfUrl: string,
  token: string,
  config: StimuliPlotRequest
): Promise<StimuliPlotResponse[]> => {
  const response = await fetch(
    `${blueNaasUrl}/simulation/stimulation-plot?model_id=${encodeURIComponent(modelSelfUrl)}`,
    {
      method: 'post',
      headers: {
        accept: 'application/json',
        authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...config,
      }),
    }
  );
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Stimuli plot could not be retrieved');
};
