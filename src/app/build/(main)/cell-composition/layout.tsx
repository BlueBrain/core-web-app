'use client';

import { ReactNode, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtomValue } from 'jotai';
import { ErrorBoundary } from 'react-error-boundary';
import { usePathname } from 'next/navigation';
import {
  CollapsedRegionDetailsSidebar,
  ExpandedRegionDetailsSidebar,
} from '@/components/build-section/BrainRegionSelector';
import { extraPanelContainerAtom } from '@/state/build-section/layout';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import CellCompositionTabs from '@/components/CellCompositionTabs';

type CellCompositionLayoutProps = {
  children: ReactNode;
};

export default function CellCompositionLayout({ children }: CellCompositionLayoutProps) {
  const extraPanelContainer = useAtomValue(extraPanelContainerAtom);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const router = usePathname();
  const brainRegionDetails = useMemo(() => {
    if (!extraPanelContainer) return null;

    return createPortal(
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="bg-primary-7 flex h-screen overflow-hidden">
          {!isSidebarExpanded ? (
            <CollapsedRegionDetailsSidebar setIsSidebarExpanded={setIsSidebarExpanded} />
          ) : (
            <ExpandedRegionDetailsSidebar
              editMode={!!router?.includes('/configuration')}
              setIsSidebarExpanded={setIsSidebarExpanded}
            />
          )}
        </div>
      </ErrorBoundary>,
      extraPanelContainer
    );
  }, [extraPanelContainer, isSidebarExpanded, router]);

  return (
    <>
      {brainRegionDetails}

      <CellCompositionTabs />

      {children}
    </>
  );
}
