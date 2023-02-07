'use client';

import { useCallback, useEffect, useMemo, useRef, RefObject, Suspense, ReactNode } from 'react';
import { scaleOrdinal, schemeTableau10 } from 'd3';
import { useAtom, useAtomValue } from 'jotai/react';
import { Button, Image, Tabs } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';

import sankey from './sankey';
import { sankeyNodesReducer, getSankeyLinks, filterOutEmptyNodes } from './util';
import { SankeyLinksReducerAcc } from './types';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';
import { Composition, CompositionUnit } from '@/types/atlas';
import { brainRegionAtom, densityOrCountAtom, compositionAtom } from '@/state/brain-regions';
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

// TODO: There's probaly a nice way to combine the different reducers here...
// ... Including the sidebar composition reducer as well.
function CellDensity() {
  const [densityOrCount] = useAtom(densityOrCountAtom);
  const brainRegion = useAtomValue(brainRegionAtom);
  const composition = useAtomValue(compositionAtom);
  const { resetHistory, resetComposition } = useCompositionHistory();

  const { nodes, links } = composition ?? { nodes: [], links: [] };

  // This should be treated as a temporary solution
  // as we shouldn't expect empty composition in the end.
  if (!composition && brainRegion) {
    throw new Error(`There is no configuration data for the ${brainRegion?.title}`);
  }

  useEffect(() => {
    if (composition) {
      resetHistory(composition);
    }
  }, [brainRegion?.id, resetHistory]);

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

  const sliderItems = [
    {
      label: (
        <div className="flex gap-4 items-center px-5">
          <GripDotsVerticalIcon />
          <span>By MType</span>
        </div>
      ),
      key: 'mtype',
      children: <div />,
    },
  ];

  return (
    <>
      {sankeyData.links.length > 0 && (
        <DensityChart className="w-full" colorScale={colorScale} data={sankeyData} />
      )}
      <Tabs
        // TODO: See whether Ant-D ConfigProvider can be used instead of renderTabBar
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} className="bg-white" style={{ margin: 0 }} /> // eslint-disable-line react/jsx-props-no-spreading
        )}
        items={sliderItems}
      />
      <CellDensityToolbar onReset={handleReset} />
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
            <Suspense fallback={null}>
              <CellDensityWrapper />
            </Suspense>
          ),
        },
        { label: 'Distribution', key: 'distribution', children: <CellDistribution /> },
        { label: 'Position', key: 'position', children: <CellPosition /> },
      ]}
    />
  );
}
