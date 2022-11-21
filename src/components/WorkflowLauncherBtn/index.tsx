import { useState, useCallback } from 'react';

import { launchWorkflowTask } from '@/services/bbp-workflow';
import { WORKFLOW_TEST_TASK_NAME, WorkflowFilesType } from '@/services/bbp-workflow/config';
import { useLoginAtomValue } from '@/atoms/login';

type Props = {
  buttonText?: string;
  workflowName?: string;
  workflowFiles?: WorkflowFilesType;
};

export default function WorkflowLauncher({
  buttonText = 'Launch BBP-Workflow',
  workflowName = WORKFLOW_TEST_TASK_NAME,
  workflowFiles = [],
}: Props) {
  const [loading, setLoading] = useState(false);
  const login = useLoginAtomValue();

  const launchBbpWorkflow = useCallback(async () => {
    if (!login) return;
    setLoading(true);
    await launchWorkflowTask(login, workflowName, workflowFiles);
    setLoading(false);
  }, [login, workflowName, workflowFiles]);

  if (loading)
    return (
      <button type="button" className="flex-auto bg-green-2 text-white h-12 px-8">
        Launching...
      </button>
    );

  return (
    <button
      onClick={launchBbpWorkflow}
      type="button"
      className="flex-auto bg-green-2 text-white h-12 px-8"
    >
      {buttonText}
    </button>
  );
}
