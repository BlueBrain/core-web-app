'use client';

import { useEffect } from 'react';
import { useSetAtom, useAtom } from 'jotai';
import { RESET } from 'jotai/utils';

import { useSaveSimulationModal } from './modal-hooks';
import GenericButton from '@/components/Global/GenericButton';
import {
  secNamesAtom,
  simulationFormIsFilledAtom,
  simulationStatusAtom,
} from '@/state/simulate/single-neuron';
import { launchSimulationAtom } from '@/state/simulate/single-neuron-setter';

type Props = {
  modelSelfUrl: string;
  vLabId: string;
  projectId: string;
};

export default function LaunchButton({ modelSelfUrl, vLabId, projectId }: Props) {
  const [submittable, setSubmittable] = useAtom(simulationFormIsFilledAtom);
  const [simulationStatus, setSimulationStatus] = useAtom(simulationStatusAtom);
  const launchSimulation = useSetAtom(launchSimulationAtom);
  const { createModal: createSaveResultModal, contextHolder: saveResultModalContext } =
    useSaveSimulationModal(modelSelfUrl, vLabId, projectId);
  const [secNames, setSecNames] = useAtom(secNamesAtom);

  useEffect(() => {
    return () => {
      // atoms with reset so we can pass this signal
      setSubmittable(RESET);
      setSimulationStatus(RESET);
      setSecNames(RESET);
    };
  }, [setSubmittable, setSimulationStatus, setSecNames]);

  const { launched, finished } = simulationStatus;

  let buttonComponent = null;

  if (!launched && !finished) {
    buttonComponent = (
      <GenericButton
        text="Simulate"
        className="w-15 absolute bottom-5 right-5 mt-8 bg-primary-8 text-white"
        disabled={!submittable || secNames.length === 0}
        onClick={() => launchSimulation(modelSelfUrl)}
      />
    );
  }

  if (launched && !finished) {
    buttonComponent = (
      <GenericButton
        text="Running..."
        className="w-15 absolute bottom-5 right-5 mt-8 bg-primary-8 text-white"
        disabled
      />
    );
  }

  if (launched && finished) {
    buttonComponent = (
      <GenericButton
        text="Save"
        className="w-15 absolute bottom-5 right-5 mt-8 bg-primary-8 text-white"
        onClick={createSaveResultModal}
      />
    );
  }

  return (
    <>
      {buttonComponent}
      {saveResultModalContext}
    </>
  );
}
