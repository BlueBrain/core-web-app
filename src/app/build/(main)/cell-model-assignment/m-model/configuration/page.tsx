'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import {
  SynthesisPreview,
  ParametersContainer,
} from '@/components/build-section/cell-model-assignment/m-model';
import { selectedMModelIdAtom } from '@/state/brain-model-config/cell-model-assignment';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { fetchMModelRemoteOverridesAtom } from '@/state/brain-model-config/cell-model-assignment/m-model/setters';

export default function ConfigurationPage() {
  const selectedMModelId = useAtomValue(selectedMModelIdAtom);
  const selectedRegion = useAtomValue(selectedBrainRegionAtom);
  const mModelGetRemoteConfig = useSetAtom(fetchMModelRemoteOverridesAtom);

  useEffect(() => {
    if (!selectedRegion || !selectedMModelId) return;

    mModelGetRemoteConfig();
  }, [selectedRegion, selectedMModelId, mModelGetRemoteConfig]);

  if (!selectedMModelId || !selectedRegion)
    return (
      <div className="flex h-screen items-center justify-center text-4xl">
        Select region and M-Type
      </div>
    );

  return (
    <div className="m-5 flex">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <ParametersContainer />
        <SynthesisPreview className="ml-5 flex-grow flex h-[80vh] overflow-y-auto relative" />
      </ErrorBoundary>
    </div>
  );
}
