import { useCallback, useState } from 'react';

import { launchWorkflowTask } from '@/services/bbp-workflow';
import { WORKFLOW_TEST_TASK_NAME, WorkflowFilesType } from '@/services/bbp-workflow/config';
import { useLoginAtomValue } from '@/atoms/login';

type Props = {
  buttonText?: string;
  workflowName?: string;
  workflowFiles?: WorkflowFilesType;
  onLaunchingChange?: any;
};

export default function WorkflowLauncher({
  buttonText = 'Launch BBP-Workflow',
  workflowName = WORKFLOW_TEST_TASK_NAME,
  workflowFiles = [],
  onLaunchingChange = () => {},
}: Props) {
  const [launching, setLaunching] = useState(false);
  const login = useLoginAtomValue();

  const launchBbpWorkflow = useCallback(async () => {
    if (!login) return;
    onLaunchingChange(true);
    setLaunching(true);
    await launchWorkflowTask(login, workflowName, workflowFiles);
    onLaunchingChange(false);
    setLaunching(false);
  }, [login, workflowName, workflowFiles, onLaunchingChange]);

  return (
    <button
      onClick={launchBbpWorkflow}
      type="button"
      className="flex-auto bg-green-2 text-white h-12 px-8"
    >
      {launching ? 'Launching...' : buttonText}
    </button>
  );
}
