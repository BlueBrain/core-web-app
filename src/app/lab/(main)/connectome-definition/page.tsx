'use client';

import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { ConfigProvider, theme } from 'antd';

import { selectedPostBrainRegionsAtom, selectedPreBrainRegionsAtom } from '@/state/brain-regions';
import {
  GranularityTabs,
  ModeSwitch,
  ConnectomeDefinitionTabs,
  MatrixPreviewComponent,
  MatrixDisplayDropdown,
  HemisphereDropdown,
  MatrixModificationHistoryList,
  BrainRegionSelection,
} from '@/components/connectome-definition';
import MacroConnectome from '@/components/connectome-definition/MacroConnectome';
import styles from './connectome-definition.module.css';

function ConnectomeDefinitionMain() {
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);
  const [activeTab, setActiveTab] = useState('macro');

  return (
    <div className={styles.container}>
      <div className={styles.granularityTabs}>
        <GranularityTabs handleChange={(k: string) => setActiveTab(k)} />
      </div>
      <div className={styles.modes}>
        <ModeSwitch />
      </div>
      <div className={styles.viewTabs}>
        <ConnectomeDefinitionTabs />
      </div>
      <div className={styles.matrixContainer}>{activeTab === 'macro' && <MacroConnectome />}</div>
      <div className={styles.rightPanel}>
        <MatrixPreviewComponent />
        <MatrixDisplayDropdown />
        <HemisphereDropdown />
        <MatrixModificationHistoryList />
      </div>
      <div className={styles.leftPanel} />
      <BrainRegionSelection regions={preSynapticBrainRegions} area="pre" />
      <div className={styles.footer}>
        <BrainRegionSelection regions={postSynapticBrainRegions} area="post" />
      </div>
    </div>
  );
}

export default function ConnectomeDefinitionView() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Select: {
            borderRadius: 0,
          },
          Tabs: {
            colorPrimary: 'white',
          },
        },
      }}
    >
      <ConnectomeDefinitionMain />
    </ConfigProvider>
  );
}
