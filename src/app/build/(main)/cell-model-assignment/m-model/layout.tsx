'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/navigation';

import { extraPanelContainerAtom } from '@/state/build-section/layout';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import {
  PanelExpanded,
  PanelCollapsed,
} from '@/components/build-section/cell-model-assignment/m-model/Panel';
import {
  selectedMModelNameAtom,
  selectedMModelIdAtom,
  mModelRemoteOverridesLoadedAtom,
} from '@/state/brain-model-config/cell-model-assignment/m-model';
import useMModelQueryParam from '@/hooks/m-model-editor';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { fetchMModelRemoteOverridesAtom } from '@/state/brain-model-config/cell-model-assignment/m-model/setters';

const MMODEL_QUERY_PARAM_KEY = 'mModel';

type Props = {
  children: ReactNode;
};

export default function MModelLayout({ children }: Props) {
  useMModelQueryParam();
  const extraPanelContainer = useAtomValue(extraPanelContainerAtom);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [selectedMModelName, setSelectedMModelName] = useAtom(selectedMModelNameAtom);
  const setSelectedMModelId = useSetAtom(selectedMModelIdAtom);
  const setMModelRemoteOverridesLoaded = useSetAtom(mModelRemoteOverridesLoadedAtom);
  const brainRegion = useAtomValue(selectedBrainRegionAtom);
  const router = useRouter();
  const mModelGetRemoteConfig = useSetAtom(fetchMModelRemoteOverridesAtom);

  useEffect(() => {
    if (selectedMModelName !== null) {
      const baseUrl = '/build/cell-model-assignment/m-model/configuration';
      const urlSearchParams = new URLSearchParams(window.location.search);
      urlSearchParams.set(MMODEL_QUERY_PARAM_KEY, selectedMModelName);
      const updatedQueryParams = urlSearchParams.toString();
      router.replace(`${baseUrl}?${updatedQueryParams}`);
    }
  }, [router, selectedMModelName]);

  useEffect(() => {
    // resetting the m-type selection when brain region changes
    setSelectedMModelName(null);
    setSelectedMModelId(null);
    setMModelRemoteOverridesLoaded(false);
  }, [brainRegion, setSelectedMModelName, setSelectedMModelId, setMModelRemoteOverridesLoaded]);

  useEffect(() => {
    mModelGetRemoteConfig();
  }, [mModelGetRemoteConfig, brainRegion, selectedMModelName]);

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
