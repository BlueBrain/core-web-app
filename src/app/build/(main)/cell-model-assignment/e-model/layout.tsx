'use client';

import { ReactNode, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtomValue } from 'jotai';
import { ErrorBoundary } from 'react-error-boundary';

import { extraPanelContainerAtom } from '@/state/build-section/layout';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import {
  PanelExpanded,
  PanelCollapsed,
} from '@/components/build-section/cell-model-assignment/e-model/Panel';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import List from '@/components/build-section/cell-model-assignment/e-model/Panel/List';
import { useResetEModel } from '@/hooks/e-model-editor';

type Props = {
  children: ReactNode;
};

export default function EModelLayout({ children }: Props) {
  const extraPanelContainer = useAtomValue(extraPanelContainerAtom);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const brainRegion = useAtomValue(selectedBrainRegionAtom);

  useResetEModel();

  const brainRegionDetails = useMemo(() => {
    if (!extraPanelContainer || !brainRegion) return null;

    return createPortal(
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="bg-primary-7 flex h-screen overflow-hidden">
          {!isSidebarExpanded ? (
            <PanelCollapsed setIsSidebarExpanded={setIsSidebarExpanded} />
          ) : (
            <PanelExpanded setIsSidebarExpanded={setIsSidebarExpanded} listComponent={List} />
          )}
        </div>
      </ErrorBoundary>,
      extraPanelContainer
    );
  }, [brainRegion, extraPanelContainer, isSidebarExpanded]);

  return (
    <>
      {brainRegionDetails}

      {children}
    </>
  );
}
