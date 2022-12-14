'use client';

import { useCallback, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useSession } from 'next-auth/react';
import { notification } from 'antd';

import { classNames } from '@/util/utils';
import { launchWorkflowTask } from '@/services/bbp-workflow';
import { WORKFLOW_TEST_TASK_NAME, WorkflowFilesType } from '@/services/bbp-workflow/config';
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
  const { data: session } = useSession();
  const circuitInfo = useAtomValue(circuitAtom);

  const launchBbpWorkflow = useCallback(async () => {
    if (!session?.user) return;
    onLaunchingChange(true);
    setLaunching(true);
    try {
      await launchWorkflowTask(session, workflowName, workflowFiles, circuitInfo);
    } catch (e: any) {
      notification.open({
        message: 'Error launching workflow',
        description: e.message || '',
      });
    }
    onLaunchingChange(false);
    setLaunching(false);
  }, [session, workflowName, workflowFiles, onLaunchingChange, circuitInfo]);

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
