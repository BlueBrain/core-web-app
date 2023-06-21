'use client';

import { ReactNode, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtomValue } from 'jotai';
import { ErrorBoundary } from 'react-error-boundary';

import { extraPanelContainerAtom } from '@/state/build-section/layout';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

type Props = {
  children: ReactNode;
};

export default function MModelLayout({ children }: Props) {
  const extraPanelContainer = useAtomValue(extraPanelContainerAtom);
  const [isSidebarExpanded] = useState<boolean>(false);
  const brainRegionDetails = useMemo(() => {
    if (!extraPanelContainer) return null;

    return createPortal(
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="bg-primary-7 flex h-screen overflow-hidden">
          {!isSidebarExpanded ? (
            <div>M-Model Panel collapsed</div>
          ) : (
            <div>M-Model Panel expanded</div>
          )}
        </div>
      </ErrorBoundary>,
      extraPanelContainer
    );
  }, [extraPanelContainer, isSidebarExpanded]);

  return (
    <>
      {brainRegionDetails}

      {children}
    </>
  );
}
