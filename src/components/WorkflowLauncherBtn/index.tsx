'use client';

import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { notification } from 'antd';

import { classNames } from '@/util/utils';
import { launchWorkflowTask } from '@/services/bbp-workflow';
import { WORKFLOW_TEST_TASK_NAME } from '@/services/bbp-workflow/config';
import { useWorkflowConfig } from '@/hooks/workflow';

type Props = {
  buttonText?: string;
  workflowName?: string;
  onLaunchingChange?: any;
  className?: string;
};

export default function WorkflowLauncher({
  buttonText = 'Launch BBP-Workflow',
  workflowName = WORKFLOW_TEST_TASK_NAME,
  onLaunchingChange = () => {},
  className = '',
}: Props) {
  const [launching, setLaunching] = useState(false);
  const { data: session } = useSession();

  const workflowConfig = useWorkflowConfig(workflowName);

  const launchBbpWorkflow = useCallback(async () => {
    if (!session?.user) return;
    onLaunchingChange(true);
    setLaunching(true);
    try {
      await launchWorkflowTask({
        loginInfo: session,
        workflowName,
        workflowFiles: workflowConfig,
      });
    } catch (e: any) {
      notification.open({
        message: 'Error launching workflow',
        description: e.message || '',
      });
    }
    onLaunchingChange(false);
    setLaunching(false);
  }, [session, workflowName, workflowConfig, onLaunchingChange]);

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
