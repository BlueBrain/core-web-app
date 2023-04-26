'use client';

import { Suspense, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { ConfigProvider, theme, InputNumber, Button, Input } from 'antd';
import Plotly from 'plotly.js-dist-min';
import debounce from 'lodash/debounce';
import uniq from 'lodash/uniq';

import {
  brainRegionIdByNotationMapAtom,
  brainRegionLeaveIdxByNotationMapAtom,
  brainRegionLeavesUnsortedArrayAtom,
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
import { HemisphereDirection, WholeBrainConnectivityMatrix, Edit } from '@/types/connectome';
import { initialConnectivityStrengthTableAtom } from '@/state/brain-model-config/macro-connectome';
import brainAreaAtom from '@/state/connectome-editor/sidebar';
import styles from '../connectome-definition.module.css';

function getFlatArrayValueIdx(totalLeaves: number, srcIdx: number, dstIdx: number) {
  return srcIdx * totalLeaves + dstIdx;
}

function ConnectomeDefinitionMain() {
  const area = useAtomValue(brainAreaAtom);
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);

  const initialConnectivityStrengthTable = useAtomValue(initialConnectivityStrengthTableAtom);
  const brainRegionIdByNotationMap = useAtomValue(brainRegionIdByNotationMapAtom);
  const brainRegionLeaveIdxByNotationMap = useAtomValue(brainRegionLeaveIdxByNotationMapAtom);
  const brainRegionLeaves = useAtomValue(brainRegionLeavesUnsortedArrayAtom);

  const [hemisphereDirection, setHemisphereDirection] = useState<HemisphereDirection>('LR');

  const [offset, setOffset] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [editName, setEditName] = useState('');

  const [activeTab, setActiveTab] = useState('macro');
  const [zoom, setZoom] = useState(true);
  const [select, setSelect] = useState(false);
  const [unselect, setUnselect] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [connectivityMatrix, setConnectivityMatrix] = useState<WholeBrainConnectivityMatrix>();
  const histogramRef = useRef<HTMLDivElement>(null);
  const [histogramInitialized, setHistogramInitialized] = useState(false);
  const lineChartRef = useRef<HTMLDivElement>(null);
  const [lineChartInitialized, setLineChartInitialized] = useState(false);
  const [edits, setEdits] = useState<Edit[]>([]); // Use local state for now, will be replaced by atom

  const selectedVals: [string, string, number][] = useMemo(
    () => Array.from(selected).map((s) => JSON.parse(s)),
    [selected]
  );

  useEffect(() => {
    if (!initialConnectivityStrengthTable || !brainRegionLeaveIdxByNotationMap) return;

    const totalLeaves = brainRegionLeaveIdxByNotationMap.size;
    const flatArraySize = totalLeaves * totalLeaves;

    const matrix: Record<HemisphereDirection, Float64Array> = {
      LL: new Float64Array(flatArraySize),
      LR: new Float64Array(flatArraySize),
      RL: new Float64Array(flatArraySize),
      RR: new Float64Array(flatArraySize),
    };

    initialConnectivityStrengthTable.toArray().forEach((record) => {
      const srcIdx = brainRegionLeaveIdxByNotationMap.get(record.src) as number;
      const dstIdx = brainRegionLeaveIdxByNotationMap.get(record.dst) as number;

      const idx = getFlatArrayValueIdx(totalLeaves, srcIdx, dstIdx);

      matrix[record.side as HemisphereDirection][idx] = record.value;
    });

    setConnectivityMatrix(matrix);
  }, [initialConnectivityStrengthTable, brainRegionLeaveIdxByNotationMap]);

  const histogram = useMemo(() => selectedVals.map((v) => v[2]), [selectedVals]);

  const newHistogram = useMemo(
    () => histogram.map((v) => v * multiplier + offset),
    [histogram, multiplier, offset]
  );

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
          xbins: { start: 0, end: 'auto', size: 0.001 },
          marker: { color: 'rgba(0, 0, 0, 1)' },
        },
        {
          x: newHistogram,
          type: 'histogram',
          xbins: { start: 0, end: 'auto', size: 0.001 },
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
          x: [-1, 0, 1],
          y: [-1, 0, 1],
        },
        {
          x: [-1, 0, 1],
          y: [-1, 0, 1].map((v) => v * multiplier + offset),
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
    setEdits([
      ...edits,
      {
        name: editName,
        hemisphereDirection,
        offset,
        multiplier,
        selection: [uniq(selectedVals.map((v) => v[0])), uniq(selectedVals.map((v) => v[1]))],
      },
    ]);
    setOffset(0);
    setMultiplier(1);
    setEditName('');
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
          <Input value={editName} onChange={(e) => setEditName(e.currentTarget.value)} />
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

          <button onClick={onClick} disabled={editName === ''} type="button">
            Save
          </button>
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
            {connectivityMatrix && (
              <MacroConnectome
                select={select}
                unselect={unselect}
                zoom={zoom}
                selected={selected}
                setSelected={setSelected}
                connectivityFlatArray={connectivityMatrix[hemisphereDirection]}
                setMultiplier={setMultiplier}
                setOffset={setOffset}
              />
            )}
          </Suspense>
        )}
      </div>

      <div className={styles.rightPanel}>
        {area === null && (
          <>
            <MatrixPreviewComponent />
            <MatrixDisplayDropdown />
            <HemisphereDropdown value={hemisphereDirection} onChange={setHemisphereDirection} />
            <MatrixModificationHistoryList edits={edits} />
          </>
        )}
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
