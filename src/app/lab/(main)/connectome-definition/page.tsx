'use client';

import { Suspense, useState, useMemo } from 'react';
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
  const [zoom, setZoom] = useState(true);
  const [select, setSelect] = useState(false);
  const [unselect, setUnselect] = useState(false);
  const [selected, setSelected] = useState({});

  const someSelected = useMemo(() => !!Array.from(Object.keys(selected)).length, [selected]);
  console.log(Array.from(Object.keys(selected)).length);

  return (
    <div className={styles.container}>
      {someSelected && <div className={styles.sidePanel}>Modify connection strength</div>}
      <div className={styles.granularityTabs}>
        <GranularityTabs handleChange={(k: string) => setActiveTab(k)} />
      </div>
      <div className={styles.modes}>
        <ModeSwitch
          zoom={zoom}
          select={select}
          unselect={unselect}
          setZoom={() => {
            setZoom(true);
            setSelect(false);
            setUnselect(false);
          }}
          setSelect={() => {
            setSelect(true);
            setUnselect(false);
            setZoom(false);
          }}
          setUnselect={() => {
            setUnselect(true);
            setSelect(false);
            setZoom(false);
          }}
        />
      </div>
      <div className={styles.viewTabs}>
        <ConnectomeDefinitionTabs />
      </div>
      <div className={styles.matrixContainer}>
        {activeTab === 'macro' && (
          <Suspense fallback={null}>
            <MacroConnectome
              select={select}
              unselect={unselect}
              zoom={zoom}
              selected={selected}
              setSelected={setSelected}
            />
          </Suspense>
        )}
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
