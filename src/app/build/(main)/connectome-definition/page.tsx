'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { ConfigProvider, theme, InputNumber, Button } from 'antd';

import {
  brainRegionsUnsortedArrayAtom,
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
import MacroConnectome from '@/components/connectome-definition/MacroConnectome';
import { basePath } from '@/config';
import styles from './connectome-definition.module.css';

export type ConnectivityMatrix = { [id: string]: { [id: string]: { s: number; d: number } } };

function ConnectomeDefinitionMain() {
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);
  const [offset, setOffset] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [activeTab, setActiveTab] = useState('macro');
  const [zoom, setZoom] = useState(true);
  const [select, setSelect] = useState(false);
  const [unselect, setUnselect] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [connectivityMatrix, setConnectivityMatrix] = useState<ConnectivityMatrix>({});
  const brainRegions = useAtomValue(brainRegionsUnsortedArrayAtom);

  const brainRegionIdByTitle = useMemo(() => {
    const res: { [title: string]: string } = {};
    brainRegions?.forEach((br) => {
      res[br.title] = br.id;
    });
    return res;
  }, [brainRegions]);

  const selectedIds = useMemo(
    () =>
      Array.from(selected).map((s) => {
        const pair = JSON.parse(s);
        return [brainRegionIdByTitle[pair[0]], brainRegionIdByTitle[pair[1]]];
      }),
    [selected, brainRegionIdByTitle]
  );

  useEffect(() => {
    async function fetchConnectivity() {
      const protocol = window.location.hostname === 'localhost' ? 'http' : 'https';
      const res = await fetch(
        `${protocol}://${window.location.host}${basePath && `/${basePath}`}/connectivity-dummy.json`
      );
      const json = await res.json();
      setConnectivityMatrix(json);
    }

    fetchConnectivity();
  }, []);

  const onClick = () => {
    const matrix = { ...connectivityMatrix };

    selectedIds.forEach(([d, s]) => {
      if (!matrix[s]) return;
      if (!matrix[s][d]) return;
      const current = matrix[s][d].d;
      matrix[s][d].d = current * multiplier + offset;
    });

    setConnectivityMatrix(matrix);
    setOffset(0);
    setMultiplier(1);
    setSelected(new Set());
  };

  return (
    <div className={styles.container}>
      {selected.size > 0 && (
        <div className={styles.sidePanel}>
          <span className="font-bold text-lg">Modify connection density</span>
          <div className="flex justify-between mb-3 mt-3">
            Offset:
            <InputNumber
              value={offset}
              step={0.01}
              onChange={(value) => {
                if (!value) return;
                setOffset(value);
              }}
            />
          </div>
          <div className="flex justify-between">
            Multiplier:
            <InputNumber
              value={multiplier}
              step={0.01}
              onChange={(value) => {
                if (!value) return;
                setMultiplier(value);
              }}
            />
          </div>

          <Button onClick={onClick}>Save</Button>
        </div>
      )}
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
              connectivityMatrix={connectivityMatrix}
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
      <Suspense fallback={null}>
        <ConnectomeDefinitionMain />
      </Suspense>
    </ConfigProvider>
  );
}
