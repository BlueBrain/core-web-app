'use client';

import { Suspense, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { ConfigProvider, theme, InputNumber, Input, Button } from 'antd';
import Plotly, { Shape } from 'plotly.js-dist-min';
import debounce from 'lodash/debounce';
import uniq from 'lodash/uniq';
import { CloseOutlined } from '@ant-design/icons';
import { brainRegionLeaveIdxByNotationMapAtom } from '@/state/brain-regions';
import {
  GranularityTabs,
  ModeSwitch,
  MatrixDisplayDropdown,
  HemisphereDropdown,
  MatrixModificationHistoryList,
} from '@/components/connectome-definition';
import MacroConnectome from '@/components/connectome-definition/MacroConnectome';
import { HemisphereDirection } from '@/types/connectome';
import {
  connectivityStrengthMatrixLoadableAtom,
  editsLoadableAtom,
} from '@/state/brain-model-config/macro-connectome';
import { addEditAtom, deleteEditsAtom } from '@/state/brain-model-config/macro-connectome/setters';
import brainAreaAtom from '@/state/connectome-editor/sidebar';
import useLoadable from '@/components/connectome-definition/hooks';
import styles from '../connectome-definition.module.css';

interface Rect extends Partial<Shape> {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function ConnectomeDefinitionMain() {
  const area = useAtomValue(brainAreaAtom);
  const connectivityMatrixLoadable = useAtomValue(connectivityStrengthMatrixLoadableAtom);
  const addEdit = useSetAtom(addEditAtom);

  const brainRegionLeaveIdxByNotationMap = useAtomValue(brainRegionLeaveIdxByNotationMapAtom);
  const connectivityMatrix = useLoadable(connectivityMatrixLoadable, null);

  const [hemisphereDirection, setHemisphereDirection] = useState<HemisphereDirection>('LR');

  const [offset, setOffset] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [editName, setEditName] = useState('');
  const edits = useLoadable(useAtomValue(editsLoadableAtom), []);
  const [currentEdit, setCurrentEdit] = useState<number | null>(null);
  const deleteEdits = useSetAtom(deleteEditsAtom);

  const [activeTab, setActiveTab] = useState('macro');
  const [zoom, setZoom] = useState(true);
  const [select, setSelect] = useState(false);
  const [unselect, setUnselect] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const histogramRef = useRef<HTMLDivElement>(null);
  const [histogramInitialized, setHistogramInitialized] = useState(false);
  const lineChartRef = useRef<HTMLDivElement>(null);
  const [lineChartInitialized, setLineChartInitialized] = useState(false);
  const shapes = useRef<Rect[]>([]);

  const selectedVals: [string, string, number][] = useMemo(
    () => Array.from(selected).map((s) => JSON.parse(s)),
    [selected]
  );

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
    if (!brainRegionLeaveIdxByNotationMap) return;

    addEdit({
      name: editName,
      hemisphereDirection,
      offset,
      multiplier,
      target: {
        src: uniq(selectedVals.map((v) => brainRegionLeaveIdxByNotationMap.get(v[1]) as number)),
        dst: uniq(selectedVals.map((v) => brainRegionLeaveIdxByNotationMap.get(v[0]) as number)),
      },
    });
    setOffset(0);
    setMultiplier(1);
    setEditName('');
    setSelected(new Set());
    shapes.current = [];
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
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
          }}
        >
          <div className={styles.sidePanel}>
            <span className="font-bold text-lg">Custom name for this modified connection</span>
            <CloseOutlined
              className="float-right"
              onClick={() => {
                setSelected(new Set());
                shapes.current = [];
              }}
            />

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

            <Button onClick={onClick} disabled={editName === ''} className="w-11/12" type="primary">
              Save
            </Button>
          </div>
        </ConfigProvider>
      )}

      {currentEdit !== null && (
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
          }}
        >
          <div className={styles.sidePanel}>
            <span className="font-bold text-lg">{edits[currentEdit].name}</span>
            <CloseOutlined className="float-right" onClick={() => setCurrentEdit(null)} />

            <div className="flex justify-between mb-3 mt-3">
              Offset: {edits[currentEdit].offset}
            </div>
            <div className="flex justify-between">Multiplier: {edits[currentEdit].multiplier}</div>

            <Button
              onClick={() => {
                const deletedEdits: number[] = [];
                for (let j = currentEdit + 1; j < edits.length; j += 1) {
                  deletedEdits.push(j);
                }

                if (deletedEdits.length === 0) return;
                setCurrentEdit(null);
                deleteEdits(deletedEdits);
              }}
              className="w-11/12"
              type="primary"
            >
              Restore
            </Button>
          </div>
        </ConfigProvider>
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
                shapes={shapes}
              />
            )}
          </Suspense>
        )}
      </div>

      <div className={styles.rightPanel}>
        {area === null && (
          <>
            <MatrixDisplayDropdown />
            <HemisphereDropdown value={hemisphereDirection} onChange={setHemisphereDirection} />
            <MatrixModificationHistoryList setCurrentEdit={setCurrentEdit} />
          </>
        )}
      </div>

      <div className={styles.leftPanel} />
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
