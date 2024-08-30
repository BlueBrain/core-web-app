import { blueNaasUrl } from '@/config';
import { SimulationType } from '@/types/simulation/common';
import {
  CurrentInjectionSimulationConfig,
  RecordLocation,
  SimulationExperimentalSetup,
  SynapsesConfig,
} from '@/types/simulation/single-neuron';

export const runGenericSingleNeuronSimulation = async ({
  modelUrl,
  token,
  config,
}: {
  modelUrl: string;
  token: string;
  config: {
    recordFrom: Array<RecordLocation>;
    conditions: SimulationExperimentalSetup;
    currentInjection?: CurrentInjectionSimulationConfig;
    synapses?: SynapsesConfig;
    type: SimulationType;
    simulationDuration: number;
  };
}) => {
  return await fetch(
    `${blueNaasUrl}/simulation/single-neuron/run?model_id=${encodeURIComponent(modelUrl)}`,
    {
      method: 'post',
      headers: {
        accept: 'application/x-ndjson',
        authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    }
  );
};
