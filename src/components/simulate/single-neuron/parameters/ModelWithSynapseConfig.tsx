import { Select } from 'antd';
import { useState } from 'react';
import Stimulation from './Stimulation';
import SynapseConfigForm from './SynapseConfigForm';
import {
  SimAction,
  SimConfig,
  SynapsesConfig,
  isSingleModelSimConfig,
} from '@/types/simulate/single-neuron';

enum SimulationType {
  OnlySynapse = 'OnlySynapse',
  OnlyDirectInjection = 'OnlyDirectInjection',
  Both = 'Both',
}

type Props = {
  simConfig: SimConfig;
  onChange: (action: SimAction) => void;
  defaultSynapsesConfig: SynapsesConfig;
  synapses: string[];
};

export default function ModelWithSynapseConfig({
  simConfig,
  onChange,
  defaultSynapsesConfig,
  synapses,
}: Props) {
  const [simulationType, setSimulationType] = useState<SimulationType>(SimulationType.Both);
  const onSimulationTypeChange = (newType: SimulationType) => {
    setSimulationType(newType);
    if (newType === SimulationType.Both) {
      onChange({
        type: 'SET_STIMULUS_AND_SYNAPSES',
        payload: simConfig.synapses ?? defaultSynapsesConfig,
      });
    }
    if (newType === SimulationType.OnlyDirectInjection) {
      onChange({ type: 'SET_ONLY_STIMULUS', payload: undefined });
    }
    if (newType === SimulationType.OnlySynapse) {
      onChange({ type: 'SET_ONLY_SYNAPSES', payload: simConfig.synapses ?? defaultSynapsesConfig });
    }
  };

  return (
    <div className="text-left">
      <Select
        defaultValue={SimulationType.Both}
        onChange={(value: SimulationType) => onSimulationTypeChange(value)}
        options={SimulationOptions}
        popupMatchSelectWidth={false}
      />

      <div className="mt-4">
        {(simulationType === SimulationType.Both ||
          simulationType === SimulationType.OnlyDirectInjection) &&
          isSingleModelSimConfig(simConfig) && (
            <div className="borger-primary-8 border" data-testid="direct-current-configuration">
              <div className="flex h-[36px] w-full items-center bg-primary-8 px-2 text-lg text-white">
                Direct Current Injection
              </div>
              <Stimulation
                onChange={onChange}
                simConfig={simConfig}
                onAddDirectStimConfig={() => {
                  onChange({
                    type: 'ADD_STIMULATION_CONFIG',
                    payload: undefined,
                  });
                }}
                onRemoveDirectStimConfig={(stimulationId: number) => {
                  onChange({
                    type: 'REMOVE_STIMULATION_CONFIG',
                    payload: { stimulationId },
                  });
                }}
              />
            </div>
          )}
        {(simulationType === SimulationType.Both ||
          simulationType === SimulationType.OnlySynapse) && (
          <div className="borger-primary-8 mt-4 border" data-testid="synapses-configuration">
            <div className="flex h-[36px] w-full items-center bg-primary-8 px-2 text-lg text-white">
              Synapses
            </div>
            <SynapseConfigForm
              onChange={onChange}
              synapses={synapses}
              onAddSynapseConfig={() => {
                onChange({
                  type: 'ADD_SYNAPSE',
                  payload: { ...defaultSynapsesConfig[0], id: `${simConfig.synapses!.length}` },
                });
              }}
              onRemoveSynapseConfig={(id: number) =>
                onChange({ type: 'REMOVE_SYNAPSE', payload: { id } })
              }
            />
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
