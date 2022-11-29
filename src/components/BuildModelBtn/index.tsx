'use client';

import { useCallback, useRef, useState } from 'react';

import {
  WORKFLOW_CIRCUIT_BUILD_TASK_NAME,
  CIRCUIT_BUILDING_FILES,
} from '@/services/bbp-workflow/config';
import LauncherModal from '@/components/BuildModelBtn/LauncherModal';
import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';

export default function BuildModelBtn() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const modalContainer = useRef(null);
  const [loading, setLoading] = useState(false);

  const onLaunchingChange = useCallback((newState: boolean) => {
    setLoading(newState);
  }, []);

  const onCloseModal = useCallback(() => {
    setModalIsOpen(false);
    setLoading(false);
  }, []);

  return (
    <>
      {/* need to use this to apply fonts (only in main they are applied) */}
      <div className="modal-container" ref={modalContainer} />

      <button
        onClick={() => setModalIsOpen(true)}
        type="button"
        className="flex-auto bg-secondary-2 text-white h-12 px-8"
      >
        Build
      </button>

      <LauncherModal
        isOpen={modalIsOpen}
        onCloseModal={onCloseModal}
        container={modalContainer.current}
        loading={loading}
      >
        <WorkflowLauncherBtn
          buttonText="Build"
          workflowName={WORKFLOW_CIRCUIT_BUILD_TASK_NAME}
          workflowFiles={CIRCUIT_BUILDING_FILES}
          onLaunchingChange={onLaunchingChange}
        />
      </LauncherModal>
    </>
  );
}
