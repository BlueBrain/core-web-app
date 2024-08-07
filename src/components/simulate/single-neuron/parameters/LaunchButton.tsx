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
import { SimulationType } from '@/types/simulation';

type Props = {
  modelSelfUrl: string;
  vLabId: string;
  projectId: string;
  simulationType: SimulationType;
};

export default function LaunchButton({ modelSelfUrl, vLabId, projectId, simulationType }: Props) {
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

  let buttonLabel = '';
  if (!simulationStatus) {
    buttonLabel = 'Simulate';
  }
  if (simulationStatus === 'launched') {
    buttonLabel = 'Running...';
  }
  if (simulationStatus === 'finished') {
    buttonLabel = 'Save';
  }
  const buttonComponent = (
    <GenericButton
      text={buttonLabel}
      className="w-15 absolute bottom-5 right-5 mt-8 bg-primary-8 text-white"
      disabled={!submittable || secNames.length === 0 || simulationStatus === 'launched'}
      onClick={() => {
        if (!simulationStatus) {
          launchSimulation(modelSelfUrl, simulationType);
        } else if (simulationStatus === 'finished') {
          createSaveResultModal();
        }
      }}
    />
  );

  return (
    <>
      {buttonComponent}
      {saveResultModalContext}
    </>
  );
}
