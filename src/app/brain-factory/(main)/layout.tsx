'use client';

import { ReactNode } from 'react';
import { useAtomValue } from 'jotai/react';

import BrainRegionSelector from '@/components/BrainRegionSelector';
import BrainConfigPanel from '@/components/BrainConfigPanel';
import Tabs from '@/components/BrainFactoryTabs';
import BuildModelBtn from '@/components/BuildModelBtn';
import { themeAtom } from '@/state/theme';
import WorkflowLauncher from '@/components/WorkflowLauncherBtn';
import useBrainModelConfigState from '@/hooks/brain-model-config';
import useSessionState from '@/hooks/session';
import { WORKFLOW_SIMULATION_TASK_NAME, SIMULATION_FILES } from '@/services/bbp-workflow/config';
import useEnsureLogin from '@/hooks/ensure-login';

import styles from './brain-factory-main.module.css';

type BrainFactoryLayoutProps = {
  children: ReactNode;
};

export default function BrainFactoryLayout({ children }: BrainFactoryLayoutProps) {
  useBrainModelConfigState();
  useSessionState();
  useEnsureLogin();

  const theme = useAtomValue(themeAtom);

  const bgClassName = theme === 'light' ? styles.bgThemeLight : styles.bgThemeDark;

  return (
    <div className={styles.container}>
      <div className={styles.brainConfigSelectorContainer}>
        <BrainConfigPanel baseHref="/brain-factory/cell-composition/interactive" />
      </div>

      <div className={styles.brainSelectorContainer}>
        <BrainRegionSelector />
      </div>

      <div className={`${styles.tabsContainer} ${bgClassName}`}>
        <Tabs>
          <BuildModelBtn className="w-[250px]" />
          <div className="mt-px w-[250px] flex">
            <WorkflowLauncher
              buttonText="New in silico experiment"
              workflowName={WORKFLOW_SIMULATION_TASK_NAME}
              workflowFiles={SIMULATION_FILES}
            />
          </div>
        </Tabs>
      </div>

      <div className={`${styles.contentContainer} ${bgClassName}`}>{children}</div>
    </div>
  );
}
