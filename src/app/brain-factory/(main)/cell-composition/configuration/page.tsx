'use client';

import {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
  RefObject,
  Suspense,
  ReactNode,
} from 'react';
import { scaleOrdinal, schemeTableau10 } from 'd3';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { Button, Image, Tabs } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';
import sankey from './sankey';
import {
  sankeyNodesReducer,
  getSankeyLinks,
  sumArray,
  recalculateAndGetNewNodes,
  filterOutEmptyNodes,
} from './util';
import { AboutNode, CompositionDataSet, EditorLinksProps, SankeyLinksReducerAcc } from './types';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';
import { Composition, CompositionUnit, Node, Link } from '@/types/atlas';
import {
  brainRegionAtom,
  densityOrCountAtom,
  compositionAtom,
  setCompositionAtom,
} from '@/state/brain-regions';
import { HorizontalSlider, VerticalSlider } from '@/components/Slider';
import { GripDotsVerticalIcon, ResetIcon, UndoIcon } from '@/components/icons';
import { basePath } from '@/config';
import { switchStateType, formatNumber } from '@/util/common';
import useCompositionHistory from '@/app/brain-factory/(main)/cell-composition/configuration/use-composition-history';

function CellPosition() {
  return (
    <Image
      src={`${basePath}/images/brain-factory/BBM_ComingSoon_221119.png`} // TODO: Fix this
      alt="Coming soon"
      className="object-contain"
    />
  );
}

function CellDistribution() {
  return (
    <Image
      src={`${basePath}/images/brain-factory/BBM_Distribution_V1_221119.png`} // TODO: Fix this
      alt="Coming soon"
      className="object-contain"
    />
  );
}

interface CellDensityToolbarButtonItem {
  key: string;
  children: ReactNode;
  icon?: ReactNode;
  isDisabled?: boolean;
  callback: () => void;
}

interface CellDensityToolbarProps {
  onReset: () => void;
}

function CellDensityToolbar({ onReset }: CellDensityToolbarProps) {
  const [densityOrCount, setDensityOrCount] = useAtom(densityOrCountAtom);
  const { undoComposition, redoComposition, canUndo, canRedo } = useCompositionHistory();

  const toggleDensityAndCount = useCallback(
    () =>
      setDensityOrCount((prev) => {
        const nextState =
          prev === switchStateType.DENSITY ? switchStateType.COUNT : switchStateType.DENSITY;
        return nextState as keyof CompositionUnit;
      }),
    [setDensityOrCount]
  );

  const densityOrCountDisplay = useMemo(
    () => (densityOrCount === switchStateType.DENSITY ? 'Densities [/mm³]' : 'Counts [N]'),
    [densityOrCount]
  );

  const handleUndo = useCallback(() => {
    undoComposition();
  }, [undoComposition]);

  const handleRedo = useCallback(() => {
    redoComposition();
  }, [redoComposition]);

  const items: CellDensityToolbarButtonItem[] = [
    {
      key: switchStateType.DENSITY,
      children: densityOrCountDisplay,
      callback: toggleDensityAndCount,
    },
    {
      key: 'percentage',
      children: 'Percentage',
      isDisabled: true,
      callback: () => {
        console.warn('Not implemented yet');
      },
    },
    {
      icon: <UndoIcon />,
      key: 'undo',
      children: `Undo`,
      isDisabled: !canUndo,
      callback: handleUndo,
    },
    {
      icon: <UndoIcon style={{ transform: 'scaleX(-1)' }} />,
      key: 'redo',
      children: `Redo`,
      isDisabled: !canRedo,
      callback: handleRedo,
    },
    {
      icon: <ResetIcon />,
      key: 'reset',
      children: `Reset`,
      isDisabled: !canUndo,
      callback: onReset,
    },
  ];

  return (
    <div className="flex gap-2 justify-end">
      {items.map(({ icon, key, children, callback, isDisabled }) => (
        <Button
          className="flex gap-2 items-center text-sm"
          icon={icon}
          key={key}
          type="text"
          disabled={isDisabled ?? false}
          onClick={callback}
        >
          {children}
        </Button>
      ))}
    </div>
  );
}

type DensityChartProps = { className?: string; colorScale?: Function; data: Composition };

function DensityChart({ className = '', colorScale, data }: DensityChartProps) {
  const ref: RefObject<SVGSVGElement> = useRef(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.innerHTML = ''; // Prevent duplication

      const args = [
        data,
        {
          nodeColorScale: colorScale,
          linkColor: 'source',
          linkTitle: (d: any) => `${d.source.label} → ${d.target.label}\n${d.source.value}`,
          nodeGroup: (d: any) => d.id,
          nodeLabel: (d: any) => `${d.label} (~${formatNumber(d.value)})`,
          width: 860,
        },
      ];

      sankey(ref, ...(args as any));
    }
  });

  return <svg className={className} ref={ref} />;
}

type SlidersProps = {
  about: string;
  colorScale: Function;
  nodes: AboutNode[];
  max: number;
  onChange?: (
    about: string,
    node: AboutNode,
    value: number | null,
    parentId: string | null
  ) => void;
  lockedNodeIds: string[];
  handleToggleLockSlider: (id: string) => void;
  step: number;
};

function Sliders({
  about,
  colorScale,
  nodes,
  max,
  onChange,
  lockedNodeIds,
  handleToggleLockSlider,
  step,
}: SlidersProps) {
  const [activeSliderIndex, setActiveSliderIndex] = useState<number>(0);

  const activeSlider: AboutNode = useMemo<AboutNode>(
    () => (typeof nodes[activeSliderIndex] !== 'undefined' ? nodes[activeSliderIndex] : nodes[0]),
    [activeSliderIndex, nodes]
  );

  const verticalSliders = useMemo(
    () =>
      nodes.map((node, i) => (
        <VerticalSlider
          className="flex flex-col gap-2 h-64 pt-3 px-5 pb-5 flex-auto"
          color={colorScale(node.id)}
          disabled={lockedNodeIds.includes(node.id)}
          isActive={activeSlider.id === node.id}
          key={node.id}
          label={node.label}
          max={max}
          step={step}
          onClick={() => setActiveSliderIndex(i)}
          onChange={(newValue) => onChange && onChange(about, node, newValue, null)}
          onToggleLock={() => handleToggleLockSlider(node.id)}
          value={node.value}
        />
      )),
    [
      about,
      activeSlider.id,
      colorScale,
      handleToggleLockSlider,
      lockedNodeIds,
      max,
      nodes,
      onChange,
      step,
    ]
  );

  const horizontalSliders = useMemo(
    () =>
      activeSlider.nodes &&
      activeSlider.nodes.map((nestedNode) => (
        <div key={nestedNode.id}>
          <HorizontalSlider
            color={colorScale(nestedNode.id)}
            disabled={lockedNodeIds.includes(`${activeSlider.id}__${nestedNode.id}`)}
            key={nestedNode.id}
            label={nestedNode.label}
            max={activeSlider.max}
            step={step}
            onChange={(newValue) =>
              onChange && onChange(about, nestedNode, newValue, activeSlider.id)
            }
            onToggleLock={() => handleToggleLockSlider(`${activeSlider.id}__${nestedNode.id}`)}
            value={nestedNode.value}
          />
        </div>
      )),
    [
      activeSlider.nodes,
      activeSlider.id,
      activeSlider.max,
      colorScale,
      lockedNodeIds,
      step,
      onChange,
      about,
      handleToggleLockSlider,
    ]
  );

  return (
    <div className="bg-white flex gap-10 p-3 w-full">
      <div className="flex max-w-3xl flex-auto overflow-x-scroll">{verticalSliders}</div>
      <div className="flex flex-col basis-full">
        <div className="font-bold text-primary-7">BREAKDOWN</div>
        {horizontalSliders}
      </div>
    </div>
  );
}

// TODO: There's probaly a nice way to combine the different reducers here...
// ... Including the sidebar composition reducer as well.
function CellDensity() {
  const [densityOrCount] = useAtom(densityOrCountAtom);
  const brainRegion = useAtomValue(brainRegionAtom);
  const composition = useAtomValue(compositionAtom);
  const setComposition = useSetAtom(setCompositionAtom);
  const { appendToHistory, resetHistory, resetComposition } = useCompositionHistory();

  const { nodes, links } = composition ?? { nodes: [], links: [] };
  const [lockedNodeIds, setLockedNodeIds] = useState<string[]>([]);

  // This should be treated as a temporary solution
  // as we shouldn't expect empty composition in the end.
  if (!composition && brainRegion) {
    throw new Error(`There is no configuration data for the ${brainRegion?.title}`);
  }

  useEffect(() => {
    if (composition) {
      resetHistory(composition);
    }

    // Reset all locks when switching to other brain region
    if (brainRegion?.id) {
      setLockedNodeIds([]);
    }
  }, [brainRegion?.id, resetHistory]);

  const editorLinksReducer = useCallback(
    ({ accNodes, allNodes }: EditorLinksProps, { source, target }: Link) => {
      const {
        about,
        label,
        neuronComposition: sourceComposition,
      } = allNodes.find(({ id: nodeId }) => nodeId === source) || ({} as AboutNode);
      const targetIndex = allNodes.findIndex(({ id: nodeId }) => nodeId === target);
      const { label: targetLabel, neuronComposition: targetComposition } = allNodes[targetIndex];
      const existingAbout = Object.prototype.hasOwnProperty.call(accNodes, about);
      const existingNodeIndex =
        existingAbout && accNodes[about].findIndex((node) => node.id === source);
      const newAllNodes = allNodes.filter((node, i) => targetIndex !== i);

      const totalMax = newAllNodes.reduce(
        (previousValue, currentValue) =>
          previousValue + currentValue.neuronComposition[densityOrCount],
        0
      );

      return !existingAbout || existingNodeIndex === -1
        ? ({
            accNodes: {
              ...accNodes,
              [about as string]: [
                ...(existingAbout ? accNodes[about] : []),
                {
                  id: source,
                  label,
                  max: targetComposition[densityOrCount], // No need for math, as so-far there's only one value
                  nodes: [
                    {
                      id: target,
                      label: targetLabel,
                      value: targetComposition[densityOrCount],
                    },
                  ],
                  value: sourceComposition && sourceComposition[densityOrCount],
                },
              ],
            },
            allNodes: newAllNodes,
            max: totalMax,
          } as EditorLinksProps)
        : ({
            accNodes: {
              ...accNodes,
              [about]: [
                ...accNodes[about].slice(0, existingNodeIndex as number),
                {
                  ...accNodes[about][existingNodeIndex as number],
                  max: sumArray([
                    accNodes[about][existingNodeIndex as number].max,
                    targetComposition[densityOrCount],
                  ]),
                  nodes: [
                    ...accNodes[about][existingNodeIndex as number].nodes,
                    { id: target, label: targetLabel, value: targetComposition[densityOrCount] },
                  ],
                },
                ...accNodes[about].slice((existingNodeIndex as number) + 1),
              ],
            },
            allNodes: newAllNodes,
            max: totalMax,
          } as EditorLinksProps);
    },
    [densityOrCount]
  );

  const sankeyData = useMemo(
    () =>
      ({
        links: getSankeyLinks(links, nodes, 'neuronComposition', densityOrCount),
        nodes: filterOutEmptyNodes(
          nodes.reduce(sankeyNodesReducer, []),
          'neuronComposition',
          densityOrCount
        ),
        type: 'neuronComposition',
        value: densityOrCount,
      } as SankeyLinksReducerAcc),
    [densityOrCount, links, nodes]
  );

  const { accNodes: editorNodes, max } = useMemo(
    () =>
      links &&
      links.reduce(editorLinksReducer, {
        accNodes: {},
        allNodes: nodes,
        max: 0,
      }),
    [editorLinksReducer, links, nodes]
  );

  // Prevent colorScale from ever changing after initial render
  const colorScale = useMemo(
    () =>
      scaleOrdinal(
        Object.entries(sankeyData.nodes).map((id) => id), // eslint-disable-line @typescript-eslint/no-unused-vars
        schemeTableau10
      ),
    [sankeyData.nodes]
  );

  const handleSliderChange = useCallback(
    (about: string, changedNode: Node, value: number | null, parentId: string | null) => {
      const newComposition = {
        links,
        nodes: recalculateAndGetNewNodes(
          about,
          changedNode,
          value,
          nodes,
          parentId,
          densityOrCount,
          lockedNodeIds
        ),
        id: changedNode.id,
        value,
      } as CompositionDataSet;

      setComposition(newComposition);
      appendToHistory(newComposition);
    },
    [densityOrCount, links, nodes, setComposition, appendToHistory, lockedNodeIds]
  );

  const handleToggleLockSlider = useCallback(
    (id: string) => {
      const existingIndex = lockedNodeIds.indexOf(id);
      const newLockedNodes =
        existingIndex === -1
          ? [...lockedNodeIds, id]
          : [...lockedNodeIds.slice(0, existingIndex), ...lockedNodeIds.slice(existingIndex + 1)];
      setLockedNodeIds(newLockedNodes);
    },
    [lockedNodeIds]
  );

  const sliderStep = useMemo(
    () => (densityOrCount === switchStateType.DENSITY ? 1 : 1),
    [densityOrCount]
  );

  const sliderItems = useMemo(() => {
    const nodeEntries = Object.entries(editorNodes);

    return nodeEntries.map(([about, sliderNodes]) => {
      sliderNodes.sort((a, b) => {
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
      });

      return {
        label: (
          <div className="flex gap-4 items-center px-5">
            <GripDotsVerticalIcon />
            <span>{`By ${about}`}</span>
          </div>
        ),
        key: about,
        children: (
          <Sliders
            about={about}
            nodes={sliderNodes}
            colorScale={colorScale}
            max={max}
            step={sliderStep}
            onChange={handleSliderChange}
            lockedNodeIds={lockedNodeIds}
            handleToggleLockSlider={handleToggleLockSlider}
          />
        ),
      };
    });
  }, [
    colorScale,
    editorNodes,
    handleSliderChange,
    handleToggleLockSlider,
    lockedNodeIds,
    max,
    sliderStep,
  ]);

  const handleReset = useCallback(() => {
    resetComposition();
    setLockedNodeIds([]);
  }, [resetComposition, setLockedNodeIds]);

  return (
    <>
      {sankeyData.links.length > 0 && (
        <DensityChart className="w-full" colorScale={colorScale} data={sankeyData} />
      )}
      <CellDensityToolbar onReset={handleReset} />
      <Tabs
        // TODO: See whether Ant-D ConfigProvider can be used instead of renderTabBar
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} className="bg-white" style={{ margin: 0 }} /> // eslint-disable-line react/jsx-props-no-spreading
        )}
        items={sliderItems}
      />
    </>
  );
}

export default function ConfigurationView() {
  const [composition] = useAtom(compositionAtom);
  return (
    <Tabs
      // TODO: There may be a way to improve this using Ant-D's ConfigProvider
      renderTabBar={(props, DefaultTabBar) => (
        <DefaultTabBar {...props} style={{ margin: '0 0 30px 0' }} /> // eslint-disable-line react/jsx-props-no-spreading
      )}
      className="mx-4 my-10"
      items={[
        {
          label: 'Density',
          key: 'density',
          children: (
            <ErrorBoundary FallbackComponent={SimpleErrorComponent} resetKeys={[composition]}>
              <Suspense fallback={null}>
                <CellDensity />
              </Suspense>
            </ErrorBoundary>
          ),
        },
        { label: 'Distribution', key: 'distribution', children: <CellDistribution /> },
        { label: 'Position', key: 'position', children: <CellPosition /> },
      ]}
    />
  );
}
