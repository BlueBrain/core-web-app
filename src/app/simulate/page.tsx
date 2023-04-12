import Image from 'next/image';

import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';
import { WORKFLOW_SIMULATION_TASK_NAME } from '@/services/bbp-workflow/config';
import { basePath } from '@/config';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import Link from '@/components/Link';

export default function VirtualLab() {
  return (
    <>
      <Link href="/experiment-designer/experiment-setup">
        <Image
          className="mv-1"
          src={`${basePath}/images/brain-simulation-placeholder.png`}
          alt="Virtual lab placeholder image"
          fill
        />
      </Link>

      <div style={{ position: 'absolute', top: '5%', right: '5%', fontSize: '20px' }}>
        <DefaultLoadingSuspense>
          <WorkflowLauncherBtn
            buttonText="New in silico experiment"
            workflowName={WORKFLOW_SIMULATION_TASK_NAME}
          />
        </DefaultLoadingSuspense>
      </div>
    </>
  );
}
