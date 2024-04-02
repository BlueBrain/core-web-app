'use client';

import { useAtomValue, useSetAtom } from 'jotai';

import { useSaveSimulationModal } from './modal-hooks';
import GenericButton from '@/components/Global/GenericButton';
import {
  secNamesAtom,
  simulationFormIsFilledAtom,
  simulationStatusAtom,
} from '@/state/simulate/single-neuron';
import { launchSimulationAtom } from '@/state/simulate/single-neuron-setter';

export default function LaunchButton() {
  const submittable = useAtomValue(simulationFormIsFilledAtom);
  const simulationStatus = useAtomValue(simulationStatusAtom);
  const launchSimulation = useSetAtom(launchSimulationAtom);
  const { createModal: createSaveResultModal, contextHolder: saveResultModalContext } =
    useSaveSimulationModal();
  const secNames = useAtomValue(secNamesAtom);

  const { launched, finished } = simulationStatus;

  let buttonComponent = null;

  if (!launched && !finished) {
    buttonComponent = (
      <GenericButton
        text="Simulate"
        className="w-15 absolute bottom-5 right-5 mt-8 bg-primary-8 text-white"
        disabled={!submittable || !secNames.length}
        onClick={launchSimulation}
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
