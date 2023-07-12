'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import {
  SynthesisPreview,
  ParametersContainer,
} from '@/components/build-section/cell-model-assignment/m-model';
import {
  selectedMModelIdAtom,
  selectedCanonicalMapAtom,
} from '@/state/brain-model-config/cell-model-assignment';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { generateBrainMTypeMapKey } from '@/util/cell-model-assignment';
import { fetchMModelRemoteOverridesAtom } from '@/state/brain-model-config/cell-model-assignment/m-model/setters';

export default function ConfigurationPage() {
  const selectedMModelId = useAtomValue(selectedMModelIdAtom);
  const selectedRegion = useAtomValue(selectedBrainRegionAtom);
  const selectedCanonicalMap = useAtomValue(selectedCanonicalMapAtom);
  const mModelGetRemoteConfig = useSetAtom(fetchMModelRemoteOverridesAtom);

  useEffect(() => {
    if (!selectedRegion || !selectedMModelId) return;

    mModelGetRemoteConfig();
  }, [selectedRegion, selectedMModelId, mModelGetRemoteConfig]);

  if (!selectedMModelId || !selectedRegion || !selectedCanonicalMap)
    return (
      <div className="flex h-screen items-center justify-center text-4xl">
        Select region and M-Type
      </div>
    );

  const isCanonical = selectedCanonicalMap.get(
    generateBrainMTypeMapKey(selectedRegion.id, selectedMModelId)
  );
  if (!isCanonical)
    return (
      <div className="flex h-screen items-center justify-center text-4xl">Placeholder model</div>
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
