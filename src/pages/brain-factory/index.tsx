import dynamic from 'next/dynamic';
import Image from 'next/image';

import {
  WORKFLOW_CIRCUIT_BUILD_TASK_NAME,
  CIRCUIT_BUILDING_FILES,
} from '@/services/bbp-workflow/config';
import { basePath } from '@/config';
import styles from './brain-factory.module.css';

const BrainRegionSelector = dynamic(() => import('@/components/BrainRegionSelector'), {
  ssr: false,
});
const Tabs = dynamic(() => import('@/components/BrainFactoryTabs'), { ssr: false });
const WorkflowLauncherBtn = dynamic(() => import('@/components/WorkflowLauncherBtn'), {
  ssr: false,
});

export default function BrainFactory() {
  return (
    <div className={styles.container}>
      <div className={styles.brainSelectorContainer}>
        <BrainRegionSelector />
      </div>
      <div className={styles.tabsContainer}>
        <Tabs>
          <WorkflowLauncherBtn
            buttonText="Build"
            workflowName={WORKFLOW_CIRCUIT_BUILD_TASK_NAME}
            workflowFiles={CIRCUIT_BUILDING_FILES}
          />
        </Tabs>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src={`${basePath}/images/cell-composition-placeholder.png`}
          alt="Cell composition placeholder image"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
