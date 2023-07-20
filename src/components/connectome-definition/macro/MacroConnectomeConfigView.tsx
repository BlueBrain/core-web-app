'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ConfigProvider, theme, InputNumber, Input, Button } from 'antd';
import Plotly, { Layout, Shape } from 'plotly.js-dist-min';
import debounce from 'lodash/debounce';
import uniq from 'lodash/uniq';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';

import { brainRegionLeaveIdxByNotationMapAtom } from '@/state/brain-regions';
import {
  ModeSwitch,
  MatrixDisplayDropdown,
  HemisphereDropdown,
  MatrixModificationHistoryList,
} from '@/components/connectome-definition';
import MacroConnectome from '@/components/connectome-definition/macro/MacroConnectome';
import { HemisphereDirection } from '@/types/connectome';
import {
  connectivityStrengthMatrixLoadableAtom,
  editsLoadableAtom,
} from '@/state/brain-model-config/macro-connectome';
import {
  addEditAtom,
  applyEditsAtom,
  writingConfigAtom,
} from '@/state/brain-model-config/macro-connectome/setters';
import {
  editNameAtom,
  offsetAtom,
  multiplierAtom,
  currentEditIdxAtom,
} from '@/components/connectome-definition/macro/state';
import brainAreaAtom from '@/state/connectome-editor/sidebar';
import { useLoadable } from '@/hooks/hooks';
import { getFlatArrayValueIdx } from '@/util/connectome';
import styles from '../connectome-definition-view.module.scss';

interface Rect extends Partial<Shape> {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const STAT_CHART_DEFAULT_LAYOUT: Partial<Layout> = {
  xaxis: {
    automargin: true,
    fixedrange: true,
    zeroline: false,
    title: { text: 'synapses/µm³ ', font: { size: 12 }, standoff: 6 },
  },
  yaxis: {
    automargin: true,
    fixedrange: true,
    zeroline: false,
    title: { text: 'Number of pathways', font: { size: 12 }, standoff: 6 },
  },
  legend: { orientation: 'h', xanchor: 'center', x: 0.5, y: 1.2, font: { size: 10 } },
  width: 245,
  height: 200,
  margin: { t: 0, r: 0, b: 0, l: 20 },
};

export default function ConnectomeConfigurationView() {
  const area = useAtomValue(brainAreaAtom);
  const writingConfig = useAtomValue(writingConfigAtom);

  const brainRegionLeaveIdxByNotationMap = useAtomValue(brainRegionLeaveIdxByNotationMapAtom);
  const connectivityMatrix = useLoadable(connectivityStrengthMatrixLoadableAtom, null);

  const [hemisphereDirection, setHemisphereDirection] = useState<HemisphereDirection>('LR');

  const [offset, setOffset] = useAtom(offsetAtom);
  const [multiplier, setMultiplier] = useAtom(multiplierAtom);
  const [editName, setEditName] = useAtom(editNameAtom);
  const [currentEditIdx, setCurrentEditIdx] = useAtom(currentEditIdxAtom);
  const edits = useLoadable(editsLoadableAtom, []);
  const addEdit = useSetAtom(addEditAtom);
  const applyEdits = useSetAtom(applyEditsAtom);

  const [zoom, setZoom] = useState(true);
  const [select, setSelect] = useState(false);
  const [unselect, setUnselect] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const histogramRef = useRef<HTMLDivElement>(null);
  const [histogramInitialized, setHistogramInitialized] = useState(false);
  const selectionShapes = useRef<Rect[]>([]);

  useEffect(() => {
    if (currentEditIdx === null || !connectivityMatrix) return;
    const edit = edits[currentEditIdx];
    if (!edit) return;
    setOffset(edit.offset);
    setMultiplier(edit.multiplier);
    setEditName(edit.name);

    const flatArray = connectivityMatrix[edit.hemisphereDirection];
    const matrixSize = Math.sqrt(flatArray.length);

    const selections = new Set<string>();

    edit.target.src.forEach((srcIdx) => {
      edit.target.dst.forEach((dstIdx) => {
        const idx = getFlatArrayValueIdx(matrixSize, srcIdx, dstIdx);
        const value = flatArray[idx];
        selections.add(JSON.stringify([dstIdx, srcIdx, value]));
      });
    });
    setSelected(selections);
  }, [
    currentEditIdx,
    edits,
    setOffset,
    setMultiplier,
    setEditName,
    connectivityMatrix,
    hemisphereDirection,
  ]);

  const selectedVals: [string, string, number][] | [number, number, number][] = useMemo(
    () => Array.from(selected).map((s) => JSON.parse(s)),
    [selected]
  );

  const histogram = useMemo(
    () => selectedVals.map((v) => v[2]).filter((v) => v > 0),
    [selectedVals]
  );

  const newHistogram = useMemo(
    () => histogram.map((v) => v * multiplier + offset),
    [histogram, multiplier, offset]
  );

  useEffect(() => {
    if (!histogramRef.current || histogram.length === 0) return;
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
          name: 'Initial values',
        },
        {
          x: newHistogram,
          type: 'histogram',
          name: 'Modified values',
        },
      ],
      {
        ...STAT_CHART_DEFAULT_LAYOUT,
      }
    );
  }, [histogram, histogramInitialized, selected.size, newHistogram]);

  const onClick = () => {
    if (!brainRegionLeaveIdxByNotationMap) return;

    const newEdit = {
      name: editName,
      hemisphereDirection,
      offset,
      multiplier,
      target: {
        src: uniq(
          selectedVals.map((v) =>
            typeof v[1] === 'number' ? v[1] : (brainRegionLeaveIdxByNotationMap.get(v[1]) as number)
          )
        ),
        dst: uniq(
          selectedVals.map((v) =>
            typeof v[0] === 'number' ? v[0] : (brainRegionLeaveIdxByNotationMap.get(v[0]) as number)
          )
        ),
      },
    };

    if (currentEditIdx === null) addEdit(newEdit);
    else
      applyEdits([...edits.slice(0, currentEditIdx), newEdit, ...edits.slice(currentEditIdx + 1)]);

    setOffset(0);
    setMultiplier(1);
    setEditName('');
    setSelected(new Set());
    setCurrentEditIdx(null);
    selectionShapes.current = [];
  };

  const handleOffsetChange = useMemo(
    () =>
      debounce((value) => {
        if (value === null) return;
        setOffset(value);
      }, 300),
    [setOffset]
  );

  const handleMultiplierChange = useMemo(
    () =>
      debounce((value) => {
        if (value === null) return;
        setMultiplier(value);
      }, 300),
    [setMultiplier]
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
                setOffset(0);
                setMultiplier(1);
                setEditName('');
                setSelected(new Set());
                setCurrentEditIdx(null);
                selectionShapes.current = [];
              }}
            />

            <Input value={editName} onChange={(e) => setEditName(e.currentTarget.value)} />
            <div className="flex justify-between mb-3 mt-3">
              Offset, synapses/μm³:
              <InputNumber value={offset} step={0.01} onChange={handleOffsetChange} />
            </div>
            <div className="flex justify-between">
              Multiplier:
              <InputNumber value={multiplier} step={0.01} onChange={handleMultiplierChange} />
            </div>

            <div className="my-10">
              <div ref={histogramRef} />
            </div>

            <div className="mt-3">
              <Button
                onClick={onClick}
                disabled={editName === '' || writingConfig}
                loading={writingConfig}
                className="w-5/12"
                type="primary"
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setOffset(0);
                  setMultiplier(1);
                  setEditName('');
                  setSelected(new Set());
                  setCurrentEditIdx(null);
                  selectionShapes.current = [];
                }}
                className="w-5/12 ml-2"
                type="primary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </ConfigProvider>
      )}

      <div className={styles.matrixContainer}>
        {!connectivityMatrix && <LoadingOutlined className="text-4xl" />}
        {connectivityMatrix && (
          <MacroConnectome
            select={select}
            unselect={unselect}
            zoom={zoom}
            selected={selected}
            setSelected={setSelected}
            connectivityMatrix={connectivityMatrix}
            hemisphereDirection={hemisphereDirection}
            setMultiplier={setMultiplier}
            setOffset={setOffset}
            selectionShapes={selectionShapes}
          />
        )}
      </div>

      <div className={styles.rightPanel}>
        {area === null && (
          <>
            <MatrixDisplayDropdown />
            <HemisphereDropdown value={hemisphereDirection} onChange={setHemisphereDirection} />
            <MatrixModificationHistoryList />
          </>
        )}
      </div>

      <div className={styles.leftPanel}>
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
    </>
  );
}
