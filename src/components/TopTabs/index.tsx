import { useAtomValue } from 'jotai/react';
import { loadable } from 'jotai/vanilla/utils';
import { ErrorBoundary } from 'react-error-boundary';

import { useEffect, useState } from 'react';
import Tabs from '@/components/BrainFactoryTabs';
import BuildModelBtn from '@/components/BuildModelBtn';
import { themeAtom } from '@/state/theme';
import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';
import { WORKFLOW_SIMULATION_TASK_NAME } from '@/services/bbp-workflow/config';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';
import { detailedCircuitAtom } from '@/state/brain-model-config/morphology-assignment';

export default function TopTabs() {
  const theme = useAtomValue(themeAtom);
  const bgClassName = theme === 'light' ? 'bg-neutral-1' : 'bg-black';

  const [circuitWasBuilt, setCircuitWasBuilt] = useState(false);
  const detailedCircuitLoadable = useAtomValue(loadable(detailedCircuitAtom));

  useEffect(() => {
    if (detailedCircuitLoadable.state !== 'hasData') return;
    if (!detailedCircuitLoadable.data) return;
    setCircuitWasBuilt(true);
  }, [detailedCircuitLoadable]);

  return (
    <div className={bgClassName}>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Tabs>
          <BuildModelBtn className="w-[250px]" />
          <div className="mt-px w-[250px] flex">
            <WorkflowLauncherBtn
              buttonText="New in silico experiment"
              workflowName={WORKFLOW_SIMULATION_TASK_NAME}
              disabled={!circuitWasBuilt}
            />
          </div>
        </Tabs>
      </ErrorBoundary>
    </div>
  );
}
