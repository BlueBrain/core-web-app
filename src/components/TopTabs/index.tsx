import { useAtomValue } from 'jotai/react';
import { ErrorBoundary } from 'react-error-boundary';

import Tabs from '@/components/BrainFactoryTabs';
import BuildModelBtn from '@/components/BuildModelBtn';
import { themeAtom } from '@/state/theme';
import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';
import { WORKFLOW_SIMULATION_TASK_NAME } from '@/services/bbp-workflow/config';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';

export default function TopTabs() {
  const theme = useAtomValue(themeAtom);

  const bgClassName = theme === 'light' ? 'bg-neutral-1' : 'bg-black';

  return (
    <div className={bgClassName}>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Tabs>
          <BuildModelBtn className="w-[250px]" />
          <div className="mt-px w-[250px] flex">
            <WorkflowLauncherBtn
              buttonText="New in silico experiment"
              workflowName={WORKFLOW_SIMULATION_TASK_NAME}
            />
          </div>
        </Tabs>
      </ErrorBoundary>
    </div>
  );
}
