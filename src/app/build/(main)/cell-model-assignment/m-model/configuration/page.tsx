'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue } from 'jotai';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import {
  MModelPreviewImages,
  ParameterSliders,
} from '@/components/build-section/cell-model-assignment/';
import { selectedMModelNameAtom } from '@/state/brain-model-config/cell-model-assignment';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

export default function ConfigurationPage() {
  const mModelSelectedName = useAtomValue(selectedMModelNameAtom);
  const selectedRegion = useAtomValue(selectedBrainRegionAtom);

  if (!mModelSelectedName || !selectedRegion)
    return (
      <div className="flex h-screen items-center justify-center text-4xl">
        Select region and M-Type
      </div>
    );

  return (
    <div className="m-5 flex">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <ParameterSliders />
        <MModelPreviewImages className="ml-5 flex-grow flex h-[80vh] overflow-y-auto relative" />
      </ErrorBoundary>
    </div>
  );
}
