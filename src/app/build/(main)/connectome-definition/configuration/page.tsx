'use client';

import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { ConfigProvider, theme, InputNumber, Button } from 'antd';
import Plotly from 'plotly.js-dist-min';
import set from 'lodash/set';

import {
  brainRegionIdByNotationMapAtom,
  selectedPostBrainRegionsAtom,
  selectedPreBrainRegionsAtom,
} from '@/state/brain-regions';
import {
  GranularityTabs,
  ModeSwitch,
  MatrixPreviewComponent,
  MatrixDisplayDropdown,
  HemisphereDropdown,
  MatrixModificationHistoryList,
  BrainRegionSelection,
} from '@/components/connectome-definition';
import MacroConnectome from '@/components/connectome-definition/MacroConnectome';
import { HemisphereDirection, WholeBrainConnectivityMatrix } from '@/types/connectome';
import { initialConnectivityStrengthTableAtom } from '@/state/brain-model-config/macro-connectome';
import styles from '../connectome-definition.module.css';

function ConnectomeDefinitionMain() {
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);

  const initialConnectivityStrengthTable = useAtomValue(initialConnectivityStrengthTableAtom);
  const brainRegionIdByNotationMap = useAtomValue(brainRegionIdByNotationMapAtom);

  const [hemisphereDirection, setHemisphereDirection] = useState<HemisphereDirection>('LR');

  const [offset, setOffset] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [activeTab, setActiveTab] = useState('macro');
  const [zoom, setZoom] = useState(true);
  const [select, setSelect] = useState(false);
  const [unselect, setUnselect] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [connectivityMatrix, setConnectivityMatrix] = useState<WholeBrainConnectivityMatrix>({});
  const histogramRef = useRef<HTMLDivElement>(null);
  const [histogramInitialized, setHistogramInitialized] = useState(false);

  const selectedIds = useMemo(() => {
    if (!brainRegionIdByNotationMap) return [];

    return Array.from(selected).map((s) => {
      const pair = JSON.parse(s);
      return [
        brainRegionIdByNotationMap.get(pair[0]) as string,
        brainRegionIdByNotationMap.get(pair[1]) as string,
      ];
    });
  }, [selected, brainRegionIdByNotationMap]);

  useEffect(() => {
    if (!initialConnectivityStrengthTable || !brainRegionIdByNotationMap) return;

    const currentConnectivityMatrix = initialConnectivityStrengthTable
      .toArray()
      .reduce((matrix, record) => {
        if (record.side !== hemisphereDirection) return matrix;

        const srcBrainRegionId = brainRegionIdByNotationMap.get(record.src);
        const dstBrainRegionId = brainRegionIdByNotationMap.get(record.dst);

        return set(matrix, `${srcBrainRegionId}.${dstBrainRegionId}`, record.value);
      }, {});

    setConnectivityMatrix(currentConnectivityMatrix);
  }, [initialConnectivityStrengthTable, brainRegionIdByNotationMap, hemisphereDirection]);

  const histogram = useMemo(() => {
    const x: number[] = [];

    Array.from(preSynapticBrainRegions).forEach((r) => {
      const id = r[0];
      Object.entries(connectivityMatrix[id] ?? []).forEach(([targetId, value]) => {
        if (!postSynapticBrainRegions.has(targetId)) return;
        x.push(value);
      });
    });

    x.sort();
    return x;
  }, [preSynapticBrainRegions, postSynapticBrainRegions, connectivityMatrix]);

  useEffect(() => {
    if (!histogramRef.current) return;
    if (!histogramInitialized) {
      Plotly.newPlot(histogramRef.current, [], {});
      setHistogramInitialized(true);
      return;
    }
    Plotly.react(
      histogramRef.current,
      [
        {
          x: histogram,
          type: 'histogram',
          xbins: { start: 0, end: 'auto', size: 0.1 },
          marker: { color: 'rgba(0, 0, 0, 1)' },
        },
      ],
      { bargroupgap: 0.3 }
    );
  }, [histogram, histogramInitialized, selected.size]);

  const onClick = () => {
    const matrix = { ...connectivityMatrix };

    selectedIds.forEach(([d, s]) => {
      const currentValue = matrix[s]?.[d] ?? 0;
      set(matrix, `${s}.${d}`, currentValue * multiplier + offset);
    });

    setConnectivityMatrix(matrix);
    setOffset(0);
    setMultiplier(1);
    setSelected(new Set());
  };

  return (
    <>
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

          <div ref={histogramRef} />

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
        <HemisphereDropdown value={hemisphereDirection} onChange={setHemisphereDirection} />
        <MatrixModificationHistoryList />
      </div>

      <div className={styles.leftPanel} />

      <BrainRegionSelection regions={preSynapticBrainRegions} area="pre" />

      <div className={styles.footer}>
        <BrainRegionSelection regions={postSynapticBrainRegions} area="post" />
      </div>
    </>
  );
}

export default function ConfigurationPage() {
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
