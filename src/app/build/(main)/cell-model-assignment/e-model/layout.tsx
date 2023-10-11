'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { ErrorBoundary } from 'react-error-boundary';

import { extraPanelContainerAtom } from '@/state/build-section/layout';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import {
  PanelExpanded,
  PanelCollapsed,
} from '@/components/build-section/cell-model-assignment/e-model/Panel';
import {
  selectedEModelAtom,
  eModelRemoteParamsLoadedAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import List from '@/components/build-section/cell-model-assignment/e-model/Panel/List';

type Props = {
  children: ReactNode;
};

export default function EModelLayout({ children }: Props) {
  const extraPanelContainer = useAtomValue(extraPanelContainerAtom);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const setSelectedEModel = useSetAtom(selectedEModelAtom);
  const setEModelRemoteOverridesLoaded = useSetAtom(eModelRemoteParamsLoadedAtom);
  const brainRegion = useAtomValue(selectedBrainRegionAtom);

  useEffect(() => {
    // resetting the m-type selection when brain region changes
    setSelectedEModel(null);
    setEModelRemoteOverridesLoaded(false);
  }, [brainRegion, setSelectedEModel, setEModelRemoteOverridesLoaded]);

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
