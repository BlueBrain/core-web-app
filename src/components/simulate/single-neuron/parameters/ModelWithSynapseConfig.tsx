import { Select } from 'antd';
import { useState } from 'react';
import { useAtomValue } from 'jotai';

import Stimulation from './Stimulation';
import SynapseSimulationFormsGroup from './SynapseSimulationFormsGroup';
import {
  useCurrentInjectionSimulationConfig,
  useSynaptomeSimulationConfig,
} from '@/state/simulate/categories';
import { SynaptomeSimulationInstanceAtom } from '@/state/simulate/categories/simulation-model';

enum SimulationType {
  OnlySynapse = 'OnlySynapse',
  OnlyDirectInjection = 'OnlyDirectInjection',
  Both = 'Both',
}

export default function ModelWithSynapseConfig() {
  const { reset: resetSynaptomeConfig, empty: clearSynaptomeConfig} = useSynaptomeSimulationConfig();
  const { reset: resetCurrentInjectionConfig, empty: clearCurrentInjectionConfig } = useCurrentInjectionSimulationConfig();
  const { configuration } = useAtomValue(SynaptomeSimulationInstanceAtom);
  const [simulationType, setSimulationType] = useState<SimulationType>(SimulationType.Both);

  const onTypeChange = (newType: SimulationType) => {
    setSimulationType(newType);
    switch (newType) {
      case SimulationType.Both: {
        resetCurrentInjectionConfig();
        if (configuration?.synapses) {
          resetSynaptomeConfig(configuration.synapses);
        }
        break;
      }
      case SimulationType.OnlyDirectInjection: {
        resetCurrentInjectionConfig();
        clearSynaptomeConfig();
        break;
      }
      case SimulationType.OnlySynapse: {
        clearCurrentInjectionConfig();
        if (configuration?.synapses) {
          resetSynaptomeConfig(configuration.synapses);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="text-left">
      <Select
        defaultValue={SimulationType.Both}
        onChange={onTypeChange}
        options={SimulationOptions}
        popupMatchSelectWidth={false}
      />
      <div className="mt-4">
        {(simulationType === SimulationType.Both ||
          simulationType === SimulationType.OnlyDirectInjection) && (
          <div data-testid="direct-current-configuration">
            <div className="flex w-full items-center bg-primary-8 px-4 py-3 text-lg text-white">
              Current Injection
            </div>
            {configuration?.meModelSelf && (
              <Stimulation modelSelfUrl={configuration?.meModelSelf} />
            )}
          </div>
        )}
        {(simulationType === SimulationType.Both ||
          simulationType === SimulationType.OnlySynapse) && (
          <div className="mt-4 " data-testid="synapses-configuration">
            <div className="flex w-full items-center bg-primary-8 px-4 py-3 text-lg text-white">
              Synaptic input
            </div>
            <SynapseSimulationFormsGroup />
          </div>
        )}
      </div>
    </div>
  );
}

const SimulationOptions = [
  { value: SimulationType.Both, label: <span>Direct Current Injection + Synapses</span> },
  {
    value: SimulationType.OnlyDirectInjection,
    label: <span>Only Direct Current Injection</span>,
  },
  { value: SimulationType.OnlySynapse, label: <span>Only Synapses</span> },
];
