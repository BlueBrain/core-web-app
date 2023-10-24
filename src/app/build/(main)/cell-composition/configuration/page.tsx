'use client';

import { useCallback, useState, useMemo, ReactNode, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useAtom, useAtomValue } from 'jotai';
import { Button, Image } from 'antd';
import * as Tabs from '@radix-ui/react-tabs';
import { ErrorBoundary } from 'react-error-boundary';
import DensityChart from './DensityChart';
import TopNavigation from '@/components/TopNavigation';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { densityOrCountAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import { ResetIcon, UndoIcon } from '@/components/icons';
import { basePath } from '@/config';
import { switchStateType } from '@/util/common';
import useCompositionHistory from '@/app/build/(main)/cell-composition/configuration/use-composition-history';
import { analysedCompositionAtom, compositionAtom } from '@/state/build-composition';
import { isConfigEditableAtom } from '@/state/brain-model-config';
import { OriginalCompositionUnit } from '@/types/composition/original';
import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';
import { toolBarAtom } from '@/state/build-section/layout';

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
  const analysedComposition = useAtomValue(analysedCompositionAtom);
  const composition = useAtomValue(compositionAtom);

  const { resetComposition } = useCompositionHistory();

  // This should be treated as a temporary solution
  // as we shouldn't expect empty composition in the end.
  if (!analysedComposition && brainRegion) {
    throw new Error(`There is no configuration data for the ${brainRegion?.title}`);
  }

  const handleReset = useCallback(() => {
    resetComposition();
  }, [resetComposition]);

  const toolBar = useAtomValue(toolBarAtom);

  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent} resetKeys={[composition]}>
      <>
        <DensityChart />
        {!!toolBar && createPortal(<CellDensityToolbar onReset={handleReset} />, toolBar)}
      </>
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
    <Tabs.Root value={activeTab} className="h-full px-4 py-4">
      <TopNavigation.PillNav
        items={tabItems}
        activeItemIndex={tabItems.findIndex(({ id }) => id === activeTab)}
      />
      {tabContent}
    </Tabs.Root>
  );
}
