'use client';

import { useCallback, useState } from 'react';
import { useAtomValue } from 'jotai/react';

import { WORKFLOW_CIRCUIT_BUILD_TASK_NAME } from '@/services/bbp-workflow/config';
import { classNames } from '@/util/utils';
import LauncherModal from '@/components/BuildModelBtn/LauncherModal';
import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';
import { cellCompositionStepsToBuildAtom } from '@/state/brain-model-config/cell-composition';

type BuildModelBtnProps = {
  className?: string;
};

export default function BuildModelBtn({ className }: BuildModelBtnProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const stepsToBuild = useAtomValue(cellCompositionStepsToBuildAtom);

  const onLaunchingChange = useCallback((newState: boolean) => {
    setLoading(newState);
  }, []);

  const onCloseModal = useCallback(() => {
    setModalIsOpen(false);
    setLoading(false);
  }, []);

  return (
    <>
      <button
        onClick={() => setModalIsOpen(true)}
        type="button"
        className={classNames('flex-auto bg-secondary-2 text-white h-12 px-8', className)}
      >
        Build
      </button>

      <LauncherModal isOpen={modalIsOpen} onCloseModal={onCloseModal} loading={loading}>
        <WorkflowLauncherBtn
          buttonText="Build"
          workflowName={WORKFLOW_CIRCUIT_BUILD_TASK_NAME}
          onLaunchingChange={onLaunchingChange}
          disabled={!stepsToBuild.length}
        />
      </LauncherModal>
    </>
  );
}
