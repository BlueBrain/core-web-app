'use client';

import { useEffect, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai/react';
import Image from 'next/image';
import { ConfigProvider, theme } from 'antd';

import {
  brainRegionsFilteredTreeAtom,
  compositionAtom,
  selectedPostBrainRegionsAtom,
  selectedPreBrainRegionsAtom,
} from '@/state/brain-regions';
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
import { BrainRegion } from '@/types/ontologies';
import calculateCompositions from '@/util/composition/composition-parser';
import styles from './connectome-definition.module.css';
import { microconnectomeConfigAtom } from '@/state/brain-model-config/microconnectome';

function findLeaves(tree: BrainRegion[]) {
  const leaves: BrainRegion[] = [];
  const queue = [...(tree ?? [])];

  while (queue.length) {
    const region = queue.shift();
    if (region && region?.items?.length === 0) {
      leaves.push(region);
    }

    region?.items?.forEach((r) => queue.push(r));
  }

  return leaves;
}

function ConnectomeDefinitionMain() {
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);
  const tree = useAtomValue(brainRegionsFilteredTreeAtom);
  const composition = useAtomValue(compositionAtom);
  const leaves = useMemo(() => findLeaves(tree || []), [tree]);
  const microconnectomeConfig = useAtomValue(microconnectomeConfigAtom);

  console.log('microconnectomeconfig', microconnectomeConfig);

  useEffect(() => {
    const fun = async () => {
      if (composition)
        console.log(
          await calculateCompositions(
            composition,
            leaves.map((l) => l.id)
          )
        );
    };

    fun();
  }, [composition, leaves]);

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
