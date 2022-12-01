'use client';

import { useCallback, useState } from 'react';
import { useAtomValue } from 'jotai';

import { classNames } from '@/util/utils';
import { launchWorkflowTask } from '@/services/bbp-workflow';
import { WORKFLOW_TEST_TASK_NAME, WorkflowFilesType } from '@/services/bbp-workflow/config';
import { useLoginAtomValue } from '@/state/login';
import circuitAtom from '@/state/circuit';

type Props = {
  buttonText?: string;
  workflowName?: string;
  workflowFiles?: WorkflowFilesType;
  onLaunchingChange?: any;
  className?: string;
};

export default function WorkflowLauncher({
  buttonText = 'Launch BBP-Workflow',
  workflowName = WORKFLOW_TEST_TASK_NAME,
  workflowFiles = [],
  onLaunchingChange = () => {},
  className = '',
}: Props) {
  const [launching, setLaunching] = useState(false);
  const login = useLoginAtomValue();
  const circuitInfo = useAtomValue(circuitAtom);

  const launchBbpWorkflow = useCallback(async () => {
    if (!login) return;
    onLaunchingChange(true);
    setLaunching(true);
    await launchWorkflowTask(login, workflowName, workflowFiles, circuitInfo);
    onLaunchingChange(false);
    setLaunching(false);
  }, [login, workflowName, workflowFiles, onLaunchingChange, circuitInfo]);

  return (
    <button
      onClick={launchBbpWorkflow}
      type="button"
      className={classNames('flex-auto bg-secondary-2 text-white h-12 px-8', className)}
    >
      {launching ? 'Launching...' : buttonText}
    </button>
  );
}
