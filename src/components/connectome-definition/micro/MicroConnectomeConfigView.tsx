import { useState, useMemo, useEffect } from 'react';
import { extent, scaleSequential, interpolatePlasma } from 'd3';
import { useAtomValue } from 'jotai';
import { Tag, TreeSelect, TreeNodeProps, Spin, Button } from 'antd';

import ViewSelector from './ViewSelector';
import { createVariantColorMap } from './utils';
import { AggregatedParamViewEntry, AggregatedVariantViewEntry } from './micro-connectome-worker';
import {
  useCreateLabelDescriptionMap,
  useGetChildNotations,
  useGetHigherLevelNodes,
  useGetLeafNodesReduceFn,
} from './hooks';
import { configPayloadAtom, workerAtom } from '@/state/brain-model-config/micro-connectome';
import sessionAtom from '@/state/session';
import { compositionAtom } from '@/state/build-composition';
import {
  brainRegionsUnsortedArrayAtom,
  brainRegionLeavesUnsortedArrayAtom,
  brainRegionsFilteredTreeAtom,
  brainRegionByNotationMapAtom,
  brainRegionByIdMapAtom,
} from '@/state/brain-regions';
import { HemisphereDropdown } from '@/components/connectome-definition';
import MicroConnectomePlot, {
  margin as plotMargin,
} from '@/components/connectome-definition/micro/MicroConnectomePlot';
import { HemisphereDirection } from '@/types/connectome';

import styles from '../connectome-definition-view.module.scss';

const brainRegionTagRender = (props: TreeNodeProps & { color?: string }) => (
  <Tag color="#313131" title={props.label} closable onClose={props.onClose}>
    <span
      className="h-[14px] w-[14px] mr-1.5 inline-block align-[-0.21em]"
      style={{ backgroundColor: props.color }}
    />
    {props.value}
  </Tag>
);

type PlotDataBase = {
  srcLabels: string[];
  dstLabels: string[];
  labelDescriptionMap: Map<string, string>;
  labelColorMap: Map<string, string>;
};

type VariantPlotData = {
  type: 'variant';
  viewData: AggregatedVariantViewEntry[];
  colorScale: (value: string) => string;
};

type ParamPlotData = {
  type: 'param';
  viewData: AggregatedParamViewEntry[];
  colorScale: (value: number) => string;
};

type PlotData = PlotDataBase & (VariantPlotData | ParamPlotData);

type ViewSelection = {
  src: string[];
  dst: string[];
};

const DEFAULT_SELECTION = ['BS', 'CB', 'CH'];

export default function MicroConnectomeConfigView() {
  const worker = useAtomValue(workerAtom);
  const session = useAtomValue(sessionAtom);

  const configPayload = useAtomValue(configPayloadAtom);
  const cellComposition = useAtomValue(compositionAtom);
  const brainRegionLeaves = useAtomValue(brainRegionLeavesUnsortedArrayAtom);
  const brainRegionsFilteredTree = useAtomValue(brainRegionsFilteredTreeAtom);

  const brainRegions = useAtomValue(brainRegionsUnsortedArrayAtom);
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);
  const brainRegionByIdMap = useAtomValue(brainRegionByIdMapAtom);

  const createLabelDescriptionMap = useCreateLabelDescriptionMap();
  const getLeafNodesReduceFn = useGetLeafNodesReduceFn();
  const getChildNotations = useGetChildNotations();
  const getHigherLevelNodes = useGetHigherLevelNodes();

  const [hemisphereDirection, setHemisphereDirection] = useState<HemisphereDirection>('LR');

  const [srcBrainRegionNotations, setSrcBrainRegionNotations] =
    useState<string[]>(DEFAULT_SELECTION);
  const [dstBrainRegionNotations, setDstBrainRegionNotations] =
    useState<string[]>(DEFAULT_SELECTION);

  const [variantExcludeSet, setVariantExcludeSet] = useState<Set<string>>(new Set());

  const [pendingAsyncOpsCount, setPendingAsyncOpsCount] = useState<number>(-1);
  const loading = pendingAsyncOpsCount !== 0;

  const [viewSelectionHistory, setViewSelectionHistory] = useState<ViewSelection[]>([
    { src: srcBrainRegionNotations, dst: dstBrainRegionNotations },
  ]);

  const variantNames = useMemo(
    () => Object.keys(configPayload?.variants ?? {}).sort(),
    [configPayload]
  );
  const variantColorMap = useMemo(() => createVariantColorMap(variantNames), [variantNames]);

  const [plotData, setPlotData] = useState<PlotData | null>(null);

  // A string representation of the current view selection, possible values:
  // 'variant' or 'param.<variantName>.<paramName>'
  const [view, setView] = useState<string>('variant');
  const [viewType, variantName, paramName] = view.split('.');

  const currentViewSelection = viewSelectionHistory.at(-1) as ViewSelection;

  const setSrc = (notations: string[]) => {
    setSrcBrainRegionNotations(notations);
    setViewSelectionHistory([{ src: notations, dst: dstBrainRegionNotations }]);
  };

  const setDst = (notations: string[]) => {
    setDstBrainRegionNotations(notations);
    setViewSelectionHistory([{ src: srcBrainRegionNotations, dst: notations }]);
  };

  useEffect(() => {
    // TODO refactor
    const init = async () => {
      if (!worker || !session || !configPayload || !cellComposition || !brainRegionLeaves) return;

      setPendingAsyncOpsCount((count) => count + 1);

      const srcMap = currentViewSelection.src
        // TODO implement sorting that will support mtypes
        // .sort(brainRegionNotationSorterFn)
        .reduce(getLeafNodesReduceFn, new Map());

      const dstMap = currentViewSelection.dst
        // TODO implement sorting that will support mtypes
        // .sort(brainRegionNotationSorterFn)
        .reduce(getLeafNodesReduceFn, new Map());

      await worker.init(configPayload, cellComposition, brainRegionLeaves, session);

      if (viewType === 'variant') {
        const colorScale = (currentVariantName: string) => {
          const variantColorByName: { [variantName: string]: string } = {
            disabled: 'slategray',
            ...variantNames.reduce((map, vn) => ({ ...map, [vn]: variantColorMap.get(vn) }), {}),
          };

          return variantColorByName[currentVariantName];
        };

        const [srcLabels, dstLabels, viewData] = await worker.createAggregatedVariantView(
          hemisphereDirection,
          srcMap,
          dstMap
        );

        // TODO implement filtering instead of deleting of already aggregated data
        variantExcludeSet.forEach((excludedVariant) =>
          viewData.forEach((viewEntry) => {
            // eslint-disable-next-line no-param-reassign
            delete viewEntry.variantCount[excludedVariant];
          })
        );

        const uniqLabels = Array.from(new Set(srcLabels.concat(dstLabels)));

        const labelDescriptionMap = createLabelDescriptionMap(uniqLabels);

        const labelColorMap = uniqLabels
          .map((label) => label.split('.')[0])
          .reduce(
            (map, brainRegionNotation) =>
              map.set(
                brainRegionNotation,
                brainRegionByNotationMap?.get(brainRegionNotation)?.colorCode
              ),
            new Map()
          );

        setPlotData({
          type: 'variant',
          srcLabels,
          dstLabels,
          labelDescriptionMap,
          viewData,
          colorScale,
          labelColorMap,
        });

        setPendingAsyncOpsCount(0);

        return;
      }

      const [srcLabels, dstLabels, viewData] = await worker.createAggregatedParamView(
        hemisphereDirection,
        variantName,
        paramName,
        srcMap,
        dstMap
      );

      const uniqLabels = Array.from(new Set(srcLabels.concat(dstLabels)));

      const labelDescriptionMap = createLabelDescriptionMap(uniqLabels);

      const labelColorMap = uniqLabels
        .map((label) => label.split('.')[0])
        .reduce(
          (map, brainRegionNotation) =>
            map.set(
              brainRegionNotation,
              brainRegionByNotationMap?.get(brainRegionNotation)?.colorCode
            ),
          new Map()
        );

      const minMaxParamValues: number[] = viewData.flatMap((viewDataEntry) => [
        viewDataEntry.min,
        viewDataEntry.max,
      ]);
      const [min, max] = extent(minMaxParamValues);

      const colorScale = scaleSequential(interpolatePlasma).domain([min ?? 0, max ?? 1]);

      setPlotData({
        type: 'param',
        srcLabels,
        dstLabels,
        labelDescriptionMap,
        viewData,
        colorScale,
        labelColorMap,
      });

      setPendingAsyncOpsCount(0);
    };

    init();
  }, [
    configPayload,
    session,
    cellComposition,
    viewSelectionHistory,
    worker,
    brainRegionLeaves,
    viewType,
    hemisphereDirection,
    variantName,
    paramName,
    brainRegions,
    variantColorMap,
    variantNames,
    variantExcludeSet,
    createLabelDescriptionMap,
    brainRegionByNotationMap,
    brainRegionByIdMap,
    currentViewSelection.src,
    currentViewSelection.dst,
    getLeafNodesReduceFn,
  ]);

  const onLabelClick = (srcLabel: string | null, dstLabel: string | null) => {
    const src = srcLabel
      ? getChildNotations(srcLabel)
      : (viewSelectionHistory.at(-1) as ViewSelection).src;
    const dst = dstLabel
      ? getChildNotations(dstLabel)
      : (viewSelectionHistory.at(-1) as ViewSelection).dst;

    setViewSelectionHistory([...viewSelectionHistory, { src, dst }]);
  };

  const onNavUpClick = (srcHierarchy: boolean, dstHierarchy: boolean) => {
    const current = viewSelectionHistory.at(-1) as ViewSelection;

    const src = srcHierarchy ? getHigherLevelNodes(current.src[0].split('.')[0]) : current.src;
    const dst = dstHierarchy ? getHigherLevelNodes(current.dst[0].split('.')[0]) : current.dst;

    setViewSelectionHistory([...viewSelectionHistory, { src, dst }]);
  };

  return (
    <>
      <div className={styles.leftPanel}>
        <h3 className="mb-3">Pre-synaptic brain regions:</h3>
        <TreeSelect
          style={{ width: '100%' }}
          allowClear
          multiple
          treeData={brainRegionsFilteredTree?.[0].items}
          treeNodeFilterProp="title"
          treeNodeLabelProp="title"
          popupMatchSelectWidth={520}
          listHeight={320}
          tagRender={(props) =>
            brainRegionTagRender({
              ...props,
              color: brainRegionByNotationMap?.get(props.value)?.colorCode,
            })
          }
          value={srcBrainRegionNotations}
          onChange={setSrc}
          fieldNames={{
            label: 'title',
            value: 'notation',
            children: 'items',
          }}
        />

        <h3 className="mt-4 mb-3">Post-synaptic brain regions:</h3>
        <TreeSelect
          style={{ width: '100%' }}
          allowClear
          multiple
          treeData={brainRegionsFilteredTree?.[0].items}
          treeNodeFilterProp="title"
          treeNodeLabelProp="title"
          popupMatchSelectWidth={520}
          tagRender={(props) =>
            brainRegionTagRender({
              ...props,
              color: brainRegionByNotationMap?.get(props.value)?.colorCode,
            })
          }
          listHeight={320}
          value={dstBrainRegionNotations}
          onChange={setDst}
          fieldNames={{
            label: 'title',
            value: 'notation',
            children: 'items',
          }}
        />

        <h3 className="mt-4 mb-3">View:</h3>
        <ViewSelector
          value={view}
          onChange={setView}
          variantColorMap={variantColorMap}
          variantExcludeSet={variantExcludeSet}
          onVariantExcludeSetChange={setVariantExcludeSet}
        />
      </div>

      <div className={styles.matrixContainer}>
        {loading && (
          <div
            className="absolute flex justify-center content-center flex-wrap bg-gray-600/[.5]"
            style={{
              left: plotMargin.left,
              right: plotMargin.right,
              top: plotMargin.top,
              bottom: plotMargin.bottom,
            }}
          >
            <Spin spinning delay={100} />
          </div>
        )}

        {plotData && (
          <>
            <MicroConnectomePlot
              type={plotData.type}
              srcLabels={plotData.srcLabels}
              dstLabels={plotData.dstLabels}
              labelDescriptionMap={plotData.labelDescriptionMap}
              viewData={plotData.viewData}
              // TODO fix type below
              // @ts-ignore-next-line
              colorScale={plotData.colorScale}
              onEntryClick={onLabelClick}
              onNavUpClick={onNavUpClick}
              labelColorMap={plotData.labelColorMap}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '-48px',
              }}
            >
              <Button
                className="mr-4"
                disabled={viewSelectionHistory.length === 1}
                onClick={() => {
                  setViewSelectionHistory(viewSelectionHistory.slice(0, -1));
                }}
              >
                Navigate back
              </Button>

              <Button
                disabled={viewSelectionHistory.length === 1}
                onClick={() => setViewSelectionHistory([viewSelectionHistory[0]])}
              >
                Reset navigation
              </Button>
            </div>
          </>
        )}
      </div>

      <div className={styles.rightPanel}>
        <HemisphereDropdown value={hemisphereDirection} onChange={setHemisphereDirection} />

        <h3>Ops count: {pendingAsyncOpsCount}</h3>
      </div>
    </>
  );
}
