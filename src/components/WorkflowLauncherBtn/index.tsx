'use client';

import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { notification } from 'antd';

import { classNames } from '@/util/utils';
import { launchWorkflowTask, workflowInstructions } from '@/services/bbp-workflow';
import { WORKFLOW_TEST_TASK_NAME } from '@/services/bbp-workflow/config';
import { useWorkflowConfig } from '@/hooks/workflow';

type Props = {
  buttonText?: string;
  workflowName?: string;
  onLaunchingChange?: any;
  className?: string;
  disabled?: boolean;
};

export default function WorkflowLauncher({
  buttonText = 'Launch BBP-Workflow',
  workflowName = WORKFLOW_TEST_TASK_NAME,
  onLaunchingChange = () => {},
  className = '',
  disabled = false,
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
      notification.success({
        message: 'Workflow launched successfuly',
      });
    } catch (e: any) {
      notification.open({
        message: 'Error launching workflow',
        description: (
          <div>
            <div>{e?.message || ''}</div>
            <div>Please run &quot;bbp-workflow version&quot; on your terminal.</div>
            <div>
              Instructions: [
              <a href={workflowInstructions} target="_blank" rel="noreferrer">
                here
              </a>
              ]
            </div>
          </div>
        ),
      });
    }
    onLaunchingChange(false);
    setLaunching(false);
  }, [session, workflowName, workflowConfig, onLaunchingChange]);

  const buttonClass = classNames(
    'flex-auto text-white h-12 px-8',
    className,
    disabled ? 'bg-slate-400 cursor-not-allowed' : 'bg-secondary-2'
  );

  const buttonTooltip = disabled ? 'Select at least one step to build' : 'Build step(s)';

  return (
    <button
      onClick={launchBbpWorkflow}
      type="button"
      className={buttonClass}
      disabled={disabled}
      title={buttonTooltip}
    >
      {launching ? 'Launching...' : buttonText}
    </button>
  );
}
