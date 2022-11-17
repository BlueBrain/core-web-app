import Image from 'next/image';

import WorkflowLauncher from '@/components/workflow-launcher-btn';
import { WORKFLOW_SIMULATION_TASK_NAME, SIMULATION_FILES } from '@/services/bbp-workflow/config';
import { basePath } from '@/config';

export default function VirtualLab() {
  return (
    <>
      <Image
        className="mv-1"
        src={`${basePath}/images/virtual-lab-placeholder.png`}
        alt="Virtual lab placeholder image"
        fill
      />
      <div style={{ position: 'absolute', top: '5%', right: '5%', fontSize: '20px' }}>
        <WorkflowLauncher
          buttonText="New in silico experiment"
          workflowName={WORKFLOW_SIMULATION_TASK_NAME}
          workflowFiles={SIMULATION_FILES}
        />
      </div>
    </>
  );
}
