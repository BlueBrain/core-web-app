'use client';

import { ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAtomValue } from 'jotai/react';
import { ErrorBoundary } from 'react-error-boundary';
import { loadable } from 'jotai/vanilla/utils';

import { RegionDetailsSidebar } from '@/components/BrainRegionSelector';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { extraPanelContainerAtom } from '@/state/brain-factory/layout';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';
import CellCompositionTabs from '@/components/CellCompositionTabs';

type CellCompositionLayoutProps = {
  children: ReactNode;
};

export default function CellCompositionLayout({ children }: CellCompositionLayoutProps) {
  const brainRegionLoadable = useAtomValue(loadable(selectedBrainRegionAtom));
  const extraPanelContainer = useAtomValue(extraPanelContainerAtom);

  const brainRegionDetails = useMemo(() => {
    if (!extraPanelContainer) return null;

    return createPortal(
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <RegionDetailsSidebar />
      </ErrorBoundary>,
      extraPanelContainer
    );
  }, [brainRegionLoadable.state, extraPanelContainer]);

  return (
    <>
      {brainRegionDetails}

      <CellCompositionTabs />

      {children}
    </>
  );
}
