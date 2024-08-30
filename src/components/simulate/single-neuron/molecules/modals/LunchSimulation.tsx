import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { Radio, RadioChangeEvent, Space } from 'antd';

import GenericButton from '@/components/Global/GenericButton';
import { SimulationType } from '@/types/simulation/common';
import { synaptomeSimulationConfigAtom } from '@/state/simulate/categories/synaptome-simulation-config';
import { currentInjectionSimulationConfigAtom } from '@/state/simulate/categories/current-injection-simulation';
import { simulationExperimentalSetupAtom } from '@/state/simulate/categories/simulation-conditions';
import { stimulusModuleParams } from '@/constants/simulate/single-neuron';
import { simulationStatusAtom } from '@/state/simulate/single-neuron';
import { launchSimulationAtom } from '@/state/simulate/single-neuron-setter';

export type Props = {
  onClose?: () => void;
  modelSelfUrl: string;
  simulationType: SimulationType;
};

export default function LunchSimulationModal({ onClose, modelSelfUrl, simulationType }: Props) {
  const experimentalSetupConfig = useAtomValue(simulationExperimentalSetupAtom);
  const currentInjectionConfig = useAtomValue(currentInjectionSimulationConfigAtom);
  const synaptomeConfig = useAtomValue(synaptomeSimulationConfigAtom);
  const [simulationDuration, setSimulationDuration] = useState<null | number>(null);
  const simulationStatus = useAtomValue(simulationStatusAtom);
  const launchSimulation = useSetAtom(launchSimulationAtom);

  const runSimulation = () => {
    if (simulationDuration) {
      launchSimulation(modelSelfUrl, simulationType, simulationDuration);
      onClose?.();
    }
  };

  const options = [
    {
      label: 'Simulation duration',
      note: 'in experiment setup',
      value: experimentalSetupConfig.max_time,
    },
    {
      label: 'Stimulation',
      note: 'in stimulation protocol',
      value: stimulusModuleParams.options.find(
        (option) => option.value === currentInjectionConfig[0].stimulus.stimulusProtocol
      )?.stopTime!,
    },
    ...synaptomeConfig.map((p, ind) => ({
      label: `Synpatic input ${ind + 1}`,
      value: p.delay + p.duration,
      note: `in synaptic input ${ind + 1}`,
    })),
  ];

  const onChange = (e: RadioChangeEvent) => setSimulationDuration(e.target.value);

  return (
    <div className="flex flex-col px-10 py-5">
      <h2 className="mb-3 text-3xl font-extrabold text-primary-8">Launch simulation experiment</h2>
      <p className="text-base font-light text-primary-8">
        In order to set up your simulation duration, we need you to pick up which of these parameter
        should determine the global duration.
      </p>
      <div className="my-5 w-full">
        <Radio.Group size="large" onChange={onChange} className="w-full">
          <Space direction="vertical" className="w-full">
            {options.map((o) => (
              <Radio
                value={o.value}
                key={`${o.label}-${o.value}`}
                className="w-full [&>span:nth-child(2)]:w-full"
              >
                <div className="flex w-full items-center justify-between gap-5">
                  <div className="line-clamp-1 flex-[1_0_35%] font-bold text-primary-8">
                    {' '}
                    {o.label}{' '}
                  </div>
                  <div className="ml-2 line-clamp-1 flex-[1_0_40%] font-light text-gray-400">
                    {o.note}
                  </div>
                  <div className="flex-[1_0_25%] font-bold text-primary-8">{o.value} ms</div>
                </div>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>
      <div className="my-5 flex flex-col items-center justify-center gap-2">
        <GenericButton
          text="Simulate"
          className="w-max bg-primary-8 text-white"
          disabled={simulationStatus?.status === 'launched' || !simulationDuration}
          loading={simulationStatus?.status === 'launched'}
          onClick={runSimulation}
          htmlType="button"
        />
        <button type="button" className="max-w-max px-4 py-3 hover:bg-gray-200" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
