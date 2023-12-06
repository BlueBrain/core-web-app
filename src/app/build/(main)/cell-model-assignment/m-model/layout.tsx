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
} from '@/components/build-section/cell-model-assignment/m-model/Panel';
import { selectedMModelNameAtom } from '@/state/brain-model-config/cell-model-assignment/m-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { fetchMModelRemoteParamsAtom } from '@/state/brain-model-config/cell-model-assignment/m-model/setters';
import { useResetMModel } from '@/hooks/m-model-editor';
import { useSessionAtomValue } from '@/hooks/hooks';

type Props = {
  children: ReactNode;
};

export default function MModelLayout({ children }: Props) {
  const extraPanelContainer = useAtomValue(extraPanelContainerAtom);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const selectedMModelName = useAtomValue(selectedMModelNameAtom);
  const brainRegion = useAtomValue(selectedBrainRegionAtom);
  const mModelGetRemoteConfig = useSetAtom(fetchMModelRemoteParamsAtom);
  const session = useSessionAtomValue();
  useResetMModel();

  useEffect(() => {
    if (!session) return;

    mModelGetRemoteConfig();
  }, [session, mModelGetRemoteConfig, brainRegion, selectedMModelName]);

  const brainRegionDetails = useMemo(() => {
    if (!extraPanelContainer || !brainRegion) return null;

    return createPortal(
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="bg-primary-7 flex h-screen overflow-hidden">
          {!isSidebarExpanded ? (
            <PanelCollapsed setIsSidebarExpanded={setIsSidebarExpanded} />
          ) : (
            <PanelExpanded setIsSidebarExpanded={setIsSidebarExpanded} />
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
