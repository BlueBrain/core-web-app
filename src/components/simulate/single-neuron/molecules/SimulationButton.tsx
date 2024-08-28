'use client';

import { useEffect, useState } from 'react';
import { useSetAtom, useAtom } from 'jotai';
import { Form } from 'antd';
import { RESET } from 'jotai/utils';

import { secNamesAtom, simulationStatusAtom } from '@/state/simulate/single-neuron';
import {
  createSingleNeuronSimulationAtom,
  launchSimulationAtom,
} from '@/state/simulate/single-neuron-setter';
import { SimulationType } from '@/types/simulation/common';
import GenericButton from '@/components/Global/GenericButton';
import useNotification from '@/hooks/notifications';

type Props = {
  modelSelfUrl: string;
  vLabId: string;
  projectId: string;
  simulationType: SimulationType;
  disabled?: boolean;
};

export default function LaunchButton({
  modelSelfUrl,
  vLabId,
  projectId,
  simulationType,
  disabled,
}: Props) {
  const form = Form.useFormInstance();
  const [loading, setLoading] = useState(false);
  const [simulationStatus, setSimulationStatus] = useAtom(simulationStatusAtom);
  const [secNames, setSecNames] = useAtom(secNamesAtom);
  const launchSimulation = useSetAtom(launchSimulationAtom);
  const createSingleNeuronSimulation = useSetAtom(createSingleNeuronSimulationAtom);

  const { error: errorNotify, success: successNotify } = useNotification();

  let buttonLabel = '';
  if (!simulationStatus) {
    buttonLabel = 'Simulate';
  }
  if (simulationStatus?.status === 'launched') {
    buttonLabel = 'Running...';
  }
  if (simulationStatus?.status === 'finished') {
    buttonLabel = 'Retry Simulation';
  }
  if (simulationStatus?.status === 'error') {
    buttonLabel = 'Retry Simulation';
    const description = simulationStatus.description ?? '';
    errorNotify(`Error while running simulation  ${description}`, undefined, 'topRight');
    setSimulationStatus(RESET);
  }

  const saveSimulation = async () => {
    try {
      setLoading(true);
      await createSingleNeuronSimulation(
        form.getFieldValue('name'),
        form.getFieldValue('description'),
        modelSelfUrl,
        vLabId,
        projectId,
        simulationType
      );
      successNotify('Simulation results saved successfully.', undefined, 'topRight');
    } catch (error) {
      errorNotify('Un error encountered when saving simulation', undefined, 'topRight');
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = () => launchSimulation(modelSelfUrl, simulationType);

  useEffect(() => {
    return () => {
      setSimulationStatus(RESET);
      setSecNames(RESET);
    };
  }, [setSimulationStatus, setSecNames]);

  const lunchBtn = (
    <GenericButton
      text={buttonLabel}
      className="w-max bg-primary-8 text-white"
      disabled={disabled || secNames.length === 0 || simulationStatus?.status === 'launched'}
      htmlType="submit"
      loading={simulationStatus?.status === 'launched'}
      onClick={runSimulation}
    />
  );

  const saveBtn = simulationStatus?.status === 'finished' && (
    <GenericButton
      text="Save imulation"
      className="w-max bg-primary-8 text-white"
      htmlType="submit"
      loading={loading}
      onClick={saveSimulation}
    />
  );

  return (
    <div className="flex items-center justify-between gap-2">
      {lunchBtn}
      {saveBtn}
    </div>
  );
}
