import { blueNaasUrl } from '@/config';
import { RunSimulationRequestBody, SynapsesConfig } from '@/types/simulation/single-neuron';

export const runSingleNeuronSimulation = async (
  modelSelfUrl: string,
  token: string,
  config: RunSimulationRequestBody
) => {
  return await fetch(
    `${blueNaasUrl}/simulation/single-neuron/run?model_id=${encodeURIComponent(modelSelfUrl)}`,
    {
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
    }
  );
};

export const runSynaptomeSimulation = async (
  synaptomeModelSelf: string,
  token: string,
  directCurrentConfig: RunSimulationRequestBody,
  synapseConfigs: SynapsesConfig
) => {
  return await fetch(
    `${blueNaasUrl}/simulation/synaptome/run?model_id=${encodeURIComponent(synaptomeModelSelf)}`,
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
