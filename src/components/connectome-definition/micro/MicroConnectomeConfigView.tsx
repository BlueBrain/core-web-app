import { useState, useEffect } from 'react';
import { extent, scaleSequential, interpolatePlasma } from 'd3';
import { useAtomValue } from 'jotai';
import { Spin, Button } from 'antd';

import ViewSelector from './ViewSelector';
import BrainRegionSelect from './MicroConnectomeBrainRegionSelect';
import { variantColorMapLoadableAtom, variantNamesLoadableAtom } from './state';
import { AggregatedParamViewEntry, AggregatedVariantViewEntry } from './micro-connectome-worker';
import {
  useAreSiblings,
  useAreTopLevelNodes,
  useCreateBrainRegionNotationTitleMap,
  useGetChildSelections,
  useGetParentSelections,
  useGetLeafNodesReduceFn,
  useSelectionSorterFn,
} from './hooks';
import { MicroConnectomeEditBar as EditBar } from './EditBar';
import { configPayloadLoadableAtom, workerAtom } from '@/state/brain-model-config/micro-connectome';
import sessionAtom from '@/state/session';
import { compositionAtom } from '@/state/build-composition';
import { connectivityStrengthMatrixAtom as macroConnectomeStrengthMatrixAtom } from '@/state/brain-model-config/macro-connectome';
import {
  brainRegionsUnsortedArrayAtom,
  brainRegionByNotationMapAtom,
  brainRegionByIdMapAtom,
} from '@/state/brain-regions';
import { HemisphereDropdown } from '@/components/connectome-definition';
import MicroConnectomePlot, {
  margin as plotMargin,
} from '@/components/connectome-definition/micro/MicroConnectomePlot';
import { HemisphereDirection, PathwaySideSelection as Selection } from '@/types/connectome';
import { useLoadable } from '@/hooks/hooks';

import styles from '../connectome-definition-view.module.scss';

type PlotDataBase = {
  srcSelections: Selection[];
  dstSelections: Selection[];
  brainRegionNotationTitleMap: Map<string, string>;
  brainRegionNotationColorMap: Map<string, string>;
  navUpDisabled: {
    src: boolean;
    dst: boolean;
  };
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
  src: Selection[];
  dst: Selection[];
};

const DEFAULT_SELECTION_BRAIN_REGIONS = ['BS', 'CB', 'CH'];

export default function MicroConnectomeConfigView() {
  const worker = useAtomValue(workerAtom);
  const session = useAtomValue(sessionAtom);

  const configPayload = useLoadable(configPayloadLoadableAtom, null);
  const cellComposition = useAtomValue(compositionAtom);

  const brainRegions = useAtomValue(brainRegionsUnsortedArrayAtom);
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);
  const brainRegionByIdMap = useAtomValue(brainRegionByIdMapAtom);

  const macroConnectomeStrengthMatrix = useAtomValue(macroConnectomeStrengthMatrixAtom);

  const variantNames = useLoadable(variantNamesLoadableAtom, []);
  const variantColorMap = useLoadable(variantColorMapLoadableAtom, new Map());

  const selectionSorterFn = useSelectionSorterFn();
  const createBrainRegionNotationTitleMap = useCreateBrainRegionNotationTitleMap();
  const getLeafNodesReduceFn = useGetLeafNodesReduceFn();
  const getChildSelections = useGetChildSelections();
  const getParentSelections = useGetParentSelections();
  const areSiblings = useAreSiblings();
  const areTopLevelNodes = useAreTopLevelNodes();

  const [hemisphereDirection, setHemisphereDirection] = useState<HemisphereDirection>('LR');

  const [srcSelections, setSrcSelections] = useState<Selection[]>(
    DEFAULT_SELECTION_BRAIN_REGIONS.map((brainRegionNotation) => ({ brainRegionNotation }))
  );

  const [dstSelections, setDstSelections] = useState<Selection[]>(
    DEFAULT_SELECTION_BRAIN_REGIONS.map((brainRegionNotation) => ({ brainRegionNotation }))
  );

  const [variantExcludeSet, setVariantExcludeSet] = useState<Set<string>>(new Set());

  const [pendingAsyncOpsCount, setPendingAsyncOpsCount] = useState<number>(0);
  const loading = pendingAsyncOpsCount !== 0;

  const [viewSelectionHistory, setViewSelectionHistory] = useState<ViewSelection[]>([
    { src: srcSelections, dst: dstSelections },
  ]);

  const [plotData, setPlotData] = useState<PlotData | null>(null);

  // A string representation of the current view selection, possible values:
  // 'variant' or 'param.<variantName>.<paramName>'
  const [view, setView] = useState<string>('variant');
  const [viewType, variantName, paramName] = view.split('.');

  const currentViewSelection = viewSelectionHistory.at(-1) as ViewSelection;

  const setSrc = (selections: Selection[]) => {
    setSrcSelections(selections);
    setViewSelectionHistory([{ src: selections, dst: dstSelections }]);
  };

  const setDst = (selections: Selection[]) => {
    setDstSelections(selections);
    setViewSelectionHistory([{ src: srcSelections, dst: selections }]);
  };

  useEffect(() => {
    // TODO refactor
    const init = async () => {
      if (
        !worker ||
        !session ||
        !configPayload ||
        !cellComposition ||
        !brainRegions ||
        !macroConnectomeStrengthMatrix
      )
        return;

      setPendingAsyncOpsCount((count) => count + 1);

      await worker.init(
        configPayload,
        cellComposition,
        brainRegions,
        macroConnectomeStrengthMatrix,
        session
      );

      if (viewType === 'variant') {
        const colorScale = (currentVariantName: string) => {
          const variantColorByName: { [variantName: string]: string } = {
            disabled: 'slategray',
            ...variantNames.reduce((map, vn) => ({ ...map, [vn]: variantColorMap.get(vn) }), {}),
          };

          return variantColorByName[currentVariantName];
        };

        const viewData = await worker.createAggregatedVariantView(
          hemisphereDirection,
          currentViewSelection.src,
          currentViewSelection.dst
        );

        const navUpDisabled = {
          src: !areSiblings(currentViewSelection.src) || areTopLevelNodes(currentViewSelection.src),
          dst: !areSiblings(currentViewSelection.dst) || areTopLevelNodes(currentViewSelection.dst),
        };

        // TODO implement filtering instead of deleting of already aggregated data
        variantExcludeSet.forEach((excludedVariant) =>
          viewData.forEach((viewEntry) => {
            // eslint-disable-next-line no-param-reassign
            delete viewEntry.variantCount[excludedVariant];
          })
        );

        const allSelections = currentViewSelection.src.concat(currentViewSelection.dst);
        const brainRegionNotationTitleMap = createBrainRegionNotationTitleMap(allSelections);

        const brainRegionNotationColorMap = allSelections.reduce(
          (map, selection) =>
            map.set(
              selection.brainRegionNotation,
              brainRegionByNotationMap?.get(selection.brainRegionNotation)?.colorCode
            ),
          new Map()
        );

        setPlotData({
          type: 'variant',
          srcSelections: currentViewSelection.src,
          dstSelections: currentViewSelection.dst,
          navUpDisabled,
          brainRegionNotationTitleMap,
          viewData,
          colorScale,
          brainRegionNotationColorMap,
        });

        setPendingAsyncOpsCount((count) => count - 1);

        return;
      }

      const viewData = await worker.createAggregatedParamView(
        hemisphereDirection,
        variantName,
        paramName,
        currentViewSelection.src,
        currentViewSelection.dst
      );

      const navUpDisabled = {
        src: !areSiblings(currentViewSelection.src) || areTopLevelNodes(currentViewSelection.src),
        dst: !areSiblings(currentViewSelection.dst) || areTopLevelNodes(currentViewSelection.dst),
      };

      const allSelections = currentViewSelection.src.concat(currentViewSelection.dst);
      const brainRegionNotationTitleMap = createBrainRegionNotationTitleMap(allSelections);

      const brainRegionNotationColorMap = allSelections.reduce(
        (map, selection) =>
          map.set(
            selection.brainRegionNotation,
            brainRegionByNotationMap?.get(selection.brainRegionNotation)?.colorCode
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
        srcSelections: currentViewSelection.src,
        dstSelections: currentViewSelection.dst,
        navUpDisabled,
        brainRegionNotationTitleMap,
        viewData,
        colorScale,
        brainRegionNotationColorMap,
      });

      setPendingAsyncOpsCount((count) => count - 1);
    };

    init();
  }, [
    configPayload,
    session,
    cellComposition,
    viewSelectionHistory,
    worker,
    viewType,
    hemisphereDirection,
    variantName,
    paramName,
    brainRegions,
    variantColorMap,
    variantNames,
    variantExcludeSet,
    brainRegionByNotationMap,
    brainRegionByIdMap,
    currentViewSelection.src,
    currentViewSelection.dst,
    getLeafNodesReduceFn,
    areSiblings,
    areTopLevelNodes,
    selectionSorterFn,
    createBrainRegionNotationTitleMap,
    srcSelections,
    dstSelections,
    macroConnectomeStrengthMatrix,
  ]);

  const onChartEntryClick = (srcSelection: Selection | null, dstSelection: Selection | null) => {
    const src = srcSelection
      ? getChildSelections(srcSelection)
      : (viewSelectionHistory.at(-1) as ViewSelection).src;

    const dst = dstSelection
      ? getChildSelections(dstSelection)
      : (viewSelectionHistory.at(-1) as ViewSelection).dst;

    setViewSelectionHistory([...viewSelectionHistory, { src, dst }]);
  };

  const onNavUpClick = (srcHierarchy: boolean, dstHierarchy: boolean) => {
    const current = viewSelectionHistory.at(-1) as ViewSelection;

    const src = srcHierarchy ? getParentSelections(current.src[0]) : current.src;
    const dst = dstHierarchy ? getParentSelections(current.dst[0]) : current.dst;

    setViewSelectionHistory([...viewSelectionHistory, { src, dst }]);
  };

  return (
    <>
      <div className={styles.leftPanel}>
        <h3 className="mb-2">Hemispheres</h3>
        <HemisphereDropdown value={hemisphereDirection} onChange={setHemisphereDirection} />

        <h3 className="mb-2 mt-4">Pre-synaptic brain regions:</h3>
        <BrainRegionSelect value={srcSelections} onChange={setSrc} extraPadding />

        <h3 className="mb-2 mt-4">Post-synaptic brain regions:</h3>
        <BrainRegionSelect value={dstSelections} onChange={setDst} extraPadding />

        <h3 className="mb-3 mt-4">View:</h3>
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
            className="absolute flex flex-wrap content-center justify-center bg-gray-600/[.5]"
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
              srcSelections={plotData.srcSelections}
              dstSelections={plotData.dstSelections}
              brainRegionNotationTitleMap={plotData.brainRegionNotationTitleMap}
              viewData={plotData.viewData}
              // TODO fix type below
              // @ts-ignore-next-line
              colorScale={plotData.colorScale}
              onEntryClick={onChartEntryClick}
              navUpDisabled={plotData.navUpDisabled}
              onNavUpClick={onNavUpClick}
              brainRegionNotationColorMap={plotData.brainRegionNotationColorMap}
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
        <EditBar />
      </div>
    </>
  );
}
