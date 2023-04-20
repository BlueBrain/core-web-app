'use client';

import { Suspense, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { ConfigProvider, theme, InputNumber, Button } from 'antd';
import Plotly from 'plotly.js-dist-min';
import set from 'lodash/set';
import debounce from 'lodash/debounce';

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
  const lineChartRef = useRef<HTMLDivElement>(null);
  const [lineChartInitialized, setLineChartInitialized] = useState(false);

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

  const modifiedConnectivityMatrix = useMemo(() => {
    const matrix = { ...connectivityMatrix };
    selectedIds.forEach(([d, s]) => {
      if (!matrix[s]) return;
      if (!matrix[s][d]) return;
      const current = matrix[s][d];
      matrix[s][d] = current * multiplier + offset;
    });
    return matrix;
  }, [connectivityMatrix, multiplier, offset, selectedIds]);

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

  const newHistogram = useMemo(() => {
    const x: number[] = [];

    Array.from(preSynapticBrainRegions).forEach((r) => {
      const id = r[0];
      Object.entries(modifiedConnectivityMatrix[id] ?? []).forEach(([targetId, value]) => {
        if (!postSynapticBrainRegions.has(targetId)) return;
        x.push(value);
      });
    });

    x.sort();
    return x;
  }, [preSynapticBrainRegions, postSynapticBrainRegions, modifiedConnectivityMatrix]);

  useEffect(() => {
    if (!histogramRef.current) return;
    if (!histogramInitialized) {
      Plotly.newPlot(histogramRef.current, [], {}, { displayModeBar: false });
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
        {
          x: newHistogram,
          type: 'histogram',
          xbins: { start: 0, end: 'auto', size: 0.1 },
          marker: { color: 'rgb(8, 143, 143, 1)' },
        },
      ],
      {
        xaxis: { showgrid: false },
        yaxis: { showgrid: false },
        bargroupgap: 0.3,
        showlegend: false,
        width: 150,
        height: 150,
        margin: {
          l: 0,
          r: 0,
          t: 0,
          b: 0,
          pad: 0,
        },
      }
    );
  }, [histogram, histogramInitialized, selected.size, newHistogram]);

  useEffect(() => {
    if (!lineChartRef.current) return;
    if (!lineChartInitialized) {
      Plotly.newPlot(lineChartRef.current, [], {}, { displayModeBar: false });
      setLineChartInitialized(true);
      return;
    }
    Plotly.react(
      lineChartRef.current,
      [
        {
          x: [0, 1],
          y: [0, 1],
        },
        {
          x: [0, 1],
          y: [0 + offset, multiplier + offset],
        },
      ],
      {
        xaxis: { showgrid: false },
        yaxis: { showgrid: false },
        showlegend: false,
        width: 150,
        height: 150,
        margin: {
          l: 0,
          r: 0,
          t: 0,
          b: 0,
          pad: 0,
        },
      }
    );
  }, [selected.size, lineChartInitialized, multiplier, offset]);

  const onClick = () => {
    setConnectivityMatrix(modifiedConnectivityMatrix);
    setOffset(0);
    setMultiplier(1);
    setSelected(new Set());
  };

  const handleOffsetChange = useCallback(
    debounce((value) => {
      if (value === null) return;
      setOffset(value);
    }, 300),
    []
  );

  const handleMultiplierChange = useCallback(
    debounce((value) => {
      if (value === null) return;
      setMultiplier(value);
    }, 300),
    []
  );

  return (
    <>
      {selected.size > 0 && (
        <div className={styles.sidePanel}>
          <span className="font-bold text-lg">Modify connection density</span>
          <div className="flex justify-between mb-3 mt-3">
            Offset:
            <InputNumber value={offset} step={0.01} onChange={handleOffsetChange} />
          </div>
          <div className="flex justify-between">
            Multiplier:
            <InputNumber value={multiplier} step={0.01} onChange={handleMultiplierChange} />
          </div>

          <div className="flex" style={{ marginTop: 10, marginBottom: 10 }}>
            <div ref={histogramRef} />
            <div ref={lineChartRef} style={{ marginTop: 11, marginLeft: 20 }} />
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
