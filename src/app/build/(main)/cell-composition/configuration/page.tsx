'use client';

import React, { useCallback, useState, useMemo, ReactNode, Suspense } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Button, Image, Spin } from 'antd';
import * as Tabs from '@radix-ui/react-tabs';
import { ErrorBoundary } from 'react-error-boundary';
import { loadable } from 'jotai/utils';
import { LoadingOutlined } from '@ant-design/icons';
import DensityChart from './DensityChart';
import TopNavigation from '@/components/TopNavigation';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { densityOrCountAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import { MissingData, ResetIcon, UndoIcon } from '@/components/icons';
import { basePath } from '@/config';
import { switchStateType } from '@/util/common';
import useCompositionHistory from '@/app/build/(main)/cell-composition/configuration/use-composition-history';
import { analysedCompositionAtom } from '@/state/build-composition';
import { isConfigEditableAtom } from '@/state/brain-model-config';
import { OriginalCompositionUnit } from '@/types/composition/original';
import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';

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
  const isConfigEditable = useAtomValue(isConfigEditableAtom);
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
    !!isConfigEditable && (
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
    )
  );
}

function CellDensity() {
  const brainRegion = useAtomValue(selectedBrainRegionAtom);
  const analysedComposition = useAtomValue(useMemo(() => loadable(analysedCompositionAtom), []));
  const { resetComposition } = useCompositionHistory();

  const handleReset = useCallback(() => {
    resetComposition();
  }, [resetComposition]);

  if (analysedComposition.state === 'loading') {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }
  if (analysedComposition.state === 'hasError') {
    return (
      <div className="flex flex-col text-primary-7 justify-center w-full h-full items-center font-bold text-xl gap-2">
        <MissingData className="w-full" style={{ color: '#0050B3' }} />
        <div>Cell composition could not be calculated</div>
      </div>
    );
  }

  // This should be treated as a temporary solution
  // as we shouldn't expect empty composition in the end.
  if (!analysedComposition && brainRegion) {
    throw new Error(`There is no configuration data for the ${brainRegion?.title}`);
  }

  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent} resetKeys={[analysedComposition.data]}>
      <DensityChart />
      <div className="flex justify-between align-center w-full">
        <CellDensityToolbar onReset={handleReset} />
      </div>
    </ErrorBoundary>
  );
}

export default function ConfigurationView() {
  const [activeTab, setActiveTab] = useState('density');

  const tabItems = [
    {
      id: 'density',
      label: 'Density',
      onClick: () => setActiveTab('density'),
    },
    {
      id: 'distribution',
      label: 'Distribution',
      onClick: () => setActiveTab('distribution'),
    },
    {
      id: 'position',
      label: 'Position',
      onClick: () => setActiveTab('position'),
    },
  ];

  const tabContent = useMemo(
    () =>
      [
        {
          children: (
            <Suspense fallback={null}>
              <CellDensity />
            </Suspense>
          ),
          value: 'density',
        },
        { children: <CellDistribution />, value: 'distribution' },
        { children: <CellPosition />, value: 'position' },
      ].map(({ children, value }) => (
        <Tabs.Content className="flex flex-col gap-5 h-full" key={value} value={value}>
          {children}
        </Tabs.Content>
      )),
    []
  );

  useLiteratureCleanNavigate();

  return (
    <Tabs.Root value={activeTab} className="h-full overflow-hidden px-4 py-4">
      <TopNavigation.PillNav
        items={tabItems}
        activeItemIndex={tabItems.findIndex(({ id }) => id === activeTab)}
      />
      {tabContent}
    </Tabs.Root>
  );
}
