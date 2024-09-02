'use client';

import { useAtomValue } from 'jotai';
import { Form } from 'antd';

import useSimulationModal from '../hooks/useSimulationModal';
import { LaunchSimulation, SaveSimulation } from './modals';
import type { LaunchSimulationProps, SaveSimulationProps } from './modals';
import { simulationStatusAtom } from '@/state/simulate/single-neuron';
import { SimulationType } from '@/types/simulation/common';

type Props = {
  modelSelfUrl: string;
  vLabId: string;
  projectId: string;
  simulationType: SimulationType;
};

export default function SimulationButton({
  modelSelfUrl,
  vLabId,
  projectId,
  simulationType,
}: Props) {
  const form = Form.useFormInstance();
  const simulationStatus = useAtomValue(simulationStatusAtom);

  const onTrySimulation = useSimulationModal<LaunchSimulationProps>({
    Content: LaunchSimulation,
  });

  const onCompleteSimulation = useSimulationModal<SaveSimulationProps>({
    showCloseIcon: false,
    Content: SaveSimulation,
  });

  const [trySimulation, lunchModalContext] = onTrySimulation({
    id: 'lunch-simulation',
    modelSelfUrl,
    simulationType,
  });

  const [saveSimulation, saveModalContext] = onCompleteSimulation({
    id: 'lunch-simulation',
    name: form.getFieldValue('name'),
    description: form.getFieldValue('description'),
    modelSelfUrl,
    vLabId,
    projectId,
    simulationType,
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        className="bg-primary-8 px-7 py-3 text-lg text-white disabled:bg-gray-300"
        onClick={trySimulation}
        disabled={simulationStatus?.status === 'launched'}
      >
        {simulationStatus?.status === 'finished' ? 'Re-run Simulation' : 'Simulate'}
      </button>
      {simulationStatus?.status === 'finished' && (
        <button
          className="w-max bg-primary-8 px-7 py-3 text-white"
          type="button"
          onClick={saveSimulation}
        >
          Save
        </button>
      )}
      {lunchModalContext}
      {saveModalContext}
    </div>
  );
}
