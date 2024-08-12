'use client';

import { useEffect } from 'react';
import { useSetAtom, useAtom } from 'jotai';
import { RESET } from 'jotai/utils';

import { useSaveSimulationModal } from './modal-hooks';
import { secNamesAtom, simulationStatusAtom } from '@/state/simulate/single-neuron';
import { launchSimulationAtom } from '@/state/simulate/single-neuron-setter';
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
  const [simulationStatus, setSimulationStatus] = useAtom(simulationStatusAtom);
  const launchSimulation = useSetAtom(launchSimulationAtom);
  const { error: notifyError } = useNotification();
  const { createModal: createSaveResultModal, contextHolder: saveResultModalContext } =
    useSaveSimulationModal(modelSelfUrl, vLabId, projectId);
  const [secNames, setSecNames] = useAtom(secNamesAtom);

  useEffect(() => {
    return () => {
      setSimulationStatus(RESET);
      setSecNames(RESET);
    };
  }, [setSimulationStatus, setSecNames]);

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
    notifyError(`Error while running simulation  ${description}`, undefined, 'topRight');
    setSimulationStatus(RESET);
  }

  const lunchBtn = (
    <GenericButton
      text={buttonLabel}
      className="w-max bg-primary-8 text-white"
      disabled={disabled || secNames.length === 0 || simulationStatus?.status === 'launched'}
      htmlType="submit"
      loading={simulationStatus?.status === 'launched'}
      onClick={() => {
        launchSimulation(modelSelfUrl, simulationType);
      }}
    />
  );

  const saveBtn = simulationStatus?.status === 'finished' && (
    <GenericButton
      text="Save imulation"
      className="w-max bg-primary-8 text-white"
      htmlType="submit"
      onClick={createSaveResultModal}
    />
  );

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        {lunchBtn}
        {saveBtn}
      </div>
      {saveResultModalContext}
    </>
  );
}
