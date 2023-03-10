'use client';

import { useAtomValue } from 'jotai';
import Image from 'next/image';
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
import { basePath } from '@/config';
import styles from './connectome-definition.module.css';

function ConnectomeDefinitionMain() {
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);

  return (
    <div className={styles.container}>
      <div className={styles.granularityTabs}>
        <GranularityTabs />
      </div>
      <div className={styles.modes}>
        <ModeSwitch />
      </div>
      <div className={styles.viewTabs}>
        <ConnectomeDefinitionTabs />
      </div>
      <div className={styles.matrixContainer}>
        <Image
          className="mv-1"
          src={`${basePath}/images/connectome-definition-placeholder.png`}
          alt="Connectome definition placeholder image"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
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
