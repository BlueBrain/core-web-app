'use client';

import {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
  RefObject,
  ReactNode,
  Suspense,
} from 'react';
import { scaleOrdinal, schemeTableau10 } from 'd3';
import { useAtom, useAtomValue } from 'jotai';
import { Button, Image } from 'antd';
import * as Tabs from '@radix-ui/react-tabs';
import { ErrorBoundary } from 'react-error-boundary';
import { sankeyNodesReducer, getSankeyLinks, filterOutEmptyNodes } from './util';
import DensityChart from './DensityChart';
import ZoomControl from './Zoom';
import { SankeyLinksReducerAcc } from './types';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { densityOrCountAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import { GripDotsVerticalIcon, ResetIcon, UndoIcon } from '@/components/icons';
import { basePath } from '@/config';
import { switchStateType } from '@/util/common';
import useCompositionHistory from '@/app/build/(main)/cell-composition/configuration/use-composition-history';
import { analysedCompositionAtom, compositionAtom } from '@/state/build-composition';
import { OriginalCompositionUnit } from '@/types/composition/original';
import styles from './tabs.module.css';

function CellPosition() {
  return (
    <Image
      src={`${basePath}/images/build/BBM_ComingSoon_221119.png`} // TODO: Fix this
      alt="Coming soon"
      className="object-contain"
    />
  );
}

function CellDistribution() {
  return (
    <Image
      src={`${basePath}/images/build/BBM_Distribution_V1_221119.png`} // TODO: Fix this
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
        return nextState as keyof OriginalCompositionUnit;
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
        console.warn('Not implemented yet'); // eslint-disable-line no-console
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

function CellDensity() {
  const [densityOrCount] = useAtom(densityOrCountAtom);
  const brainRegion = useAtomValue(selectedBrainRegionAtom);
  const composition = useAtomValue(analysedCompositionAtom);
  const { resetComposition } = useCompositionHistory();

  const { nodes, links } = composition ?? { nodes: [], links: [] };

  // This should be treated as a temporary solution
  // as we shouldn't expect empty composition in the end.
  if (!composition && brainRegion) {
    throw new Error(`There is no configuration data for the ${brainRegion?.title}`);
  }

  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (composition) {
      setZoom(1);
    }
  }, [brainRegion?.id, composition]);

  const sankeyData = useMemo(
    () =>
      ({
        links: getSankeyLinks(links, nodes, 'neuronComposition', densityOrCount),
        nodes: filterOutEmptyNodes(
          [...nodes].reduce(sankeyNodesReducer, []),
          'neuronComposition',
          densityOrCount
        ),
        type: 'neuronComposition',
        value: densityOrCount,
      } as SankeyLinksReducerAcc),
    [densityOrCount, links, nodes]
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

  const handleReset = useCallback(() => {
    resetComposition();
  }, [resetComposition]);

  // Prevent SVG from rendering whenever zoom changes
  const ref: RefObject<SVGSVGElement & { reset: () => void; zoom: (value: number) => void }> =
    useRef(null);
  const densityChart = useMemo(
    () =>
      ref && (
        <DensityChart
          className="w-full"
          colorScale={colorScale}
          data={sankeyData}
          onZoom={setZoom}
          chartRef={ref}
        />
      ),
    [colorScale, sankeyData, setZoom, ref]
  );

  return (
    <>
      {sankeyData.links.length > 0 && (
        <div className="grid gap-5">
          <ZoomControl
            onChange={(value: number) => {
              setZoom(value);
              ref?.current?.zoom(value);
            }}
            zoom={zoom}
            reset={() => {
              setZoom(1);
              ref?.current?.reset();
            }}
          />
          {densityChart}
        </div>
      )}
      <div className="flex absolute bottom-12 justify-between align-center w-full">
        <div className="bg-[#F0F0F0] rounded flex gap-4 items-center px-5">
          <GripDotsVerticalIcon />
          <span className="font-bold text-neutral-5 text-lg">By MType</span>
        </div>
        <CellDensityToolbar onReset={handleReset} />
      </div>
    </>
  );
}

function CellDensityWrapper() {
  const composition = useAtomValue(compositionAtom);
  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent} resetKeys={[composition]}>
      <CellDensity />
    </ErrorBoundary>
  );
}

export default function ConfigurationView() {
  const tabItems = useMemo(
    () =>
      [
        {
          children: 'Density',
          value: 'density',
        },
        { children: 'Distribution', value: 'distribution' },
        { children: 'Position', value: 'position' },
      ].map(({ children, value }) => (
        <Tabs.Trigger className={styles.TabTrigger} key={value} value={value}>
          {children}
        </Tabs.Trigger>
      )),
    []
  );
  const tabContent = useMemo(
    () =>
      [
        {
          children: (
            <Suspense fallback={null}>
              <CellDensityWrapper />
            </Suspense>
          ),
          value: 'density',
        },
        { children: <CellDistribution />, value: 'distribution' },
        { children: <CellPosition />, value: 'position' },
      ].map(({ children, value }) => (
        <Tabs.Content className="h-full relative" key={value} value={value}>
          {children}
        </Tabs.Content>
      )),
    []
  );

  return (
    <Tabs.Root defaultValue="density" className="h-full overflow-hidden px-4 py-[25px]">
      <Tabs.List className="items-baseline flex font-bold gap-3 mb-3">{tabItems}</Tabs.List>
      {tabContent}
    </Tabs.Root>
  );
}
