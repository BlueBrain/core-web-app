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
} from '@/components/build-section/cell-model-assignment/me-model/Panel';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import List from '@/components/build-section/cell-model-assignment/me-model/Panel/List';
import { defaultEModelPlaceholdersAtom } from '@/state/brain-model-config/cell-model-assignment/me-model';
import { useResetMEModel } from '@/hooks/me-model-editor';

type Props = {
  children: ReactNode;
};

export default function MEModelLayout({ children }: Props) {
  const extraPanelContainer = useAtomValue(extraPanelContainerAtom);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const brainRegion = useAtomValue(selectedBrainRegionAtom);
  // preload the default e-models to speed up render later
  useAtomValue(defaultEModelPlaceholdersAtom);

  useResetMEModel();

  const brainRegionDetails = useMemo(() => {
    if (!extraPanelContainer || !brainRegion) return null;

    return createPortal(
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex h-screen overflow-hidden bg-primary-7">
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
