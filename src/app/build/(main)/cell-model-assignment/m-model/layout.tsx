'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtomValue } from 'jotai';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/navigation';

import { extraPanelContainerAtom } from '@/state/build-section/layout';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import {
  MModelPanelExpanded,
  MModelPanelCollapsed,
} from '@/components/build-section/cell-model-assignment/MModelPanel';
import { selectedMModelNameAtom } from '@/state/brain-model-config/cell-model-assignment';
import useMModelQueryParam from '@/hooks/m-model-editor';

const MMODEL_QUERY_PARAM_KEY = 'mModel';

type Props = {
  children: ReactNode;
};

export default function MModelLayout({ children }: Props) {
  useMModelQueryParam();
  const extraPanelContainer = useAtomValue(extraPanelContainerAtom);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const selectedMModelName = useAtomValue(selectedMModelNameAtom);
  const router = useRouter();

  useEffect(() => {
    if (selectedMModelName !== null) {
      const baseUrl = '/build/cell-model-assignment/m-model/configuration';
      const urlSearchParams = new URLSearchParams(window.location.search);
      urlSearchParams.set(MMODEL_QUERY_PARAM_KEY, selectedMModelName);
      const updatedQueryParams = urlSearchParams.toString();
      router.replace(`${baseUrl}?${updatedQueryParams}`);
    }
  }, [router, selectedMModelName]);

  const brainRegionDetails = useMemo(() => {
    if (!extraPanelContainer) return null;

    return createPortal(
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="bg-primary-7 flex h-screen overflow-hidden">
          {!isSidebarExpanded ? (
            <MModelPanelCollapsed setIsSidebarExpanded={setIsSidebarExpanded} />
          ) : (
            <MModelPanelExpanded setIsSidebarExpanded={setIsSidebarExpanded} />
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
