'use client';

import { ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { ErrorBoundary } from 'react-error-boundary';
import { usePathname } from 'next/navigation';
import { RegionDetailsSidebar } from '@/components/BrainRegionSelector';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { extraPanelContainerAtom } from '@/state/lab/layout';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';
import CellCompositionTabs from '@/components/CellCompositionTabs';

type CellCompositionLayoutProps = {
  children: ReactNode;
};

export default function CellCompositionLayout({ children }: CellCompositionLayoutProps) {
  const brainRegionLoadable = useAtomValue(loadable(selectedBrainRegionAtom));
  const extraPanelContainer = useAtomValue(extraPanelContainerAtom);
  const router = usePathname();
  const brainRegionDetails = useMemo(() => {
    if (!extraPanelContainer) return null;

    return createPortal(
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <RegionDetailsSidebar editMode={!!router?.includes('/configuration')} />
      </ErrorBoundary>,
      extraPanelContainer
    );
  }, [brainRegionLoadable.state, extraPanelContainer, router]);

  return (
    <>
      {brainRegionDetails}

      <CellCompositionTabs />

      {children}
    </>
  );
}
