'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import {
  SynthesisPreview,
  ParametersContainer,
} from '@/components/build-section/cell-model-assignment/m-model';
import {
  selectedMModelIdAtom,
  selectedCanonicalMapAtom,
} from '@/state/brain-model-config/cell-model-assignment/m-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { generateBrainRegionMTypeMapKey } from '@/util/cell-model-assignment';
import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';

const selectedCanonicalMapAtomLoadable = loadable(selectedCanonicalMapAtom);
const baseBannerStyle = 'flex h-full items-center justify-center text-4xl';

export default function ConfigurationPage() {
  const selectedMModelId = useAtomValue(selectedMModelIdAtom);
  const selectedRegion = useAtomValue(selectedBrainRegionAtom);
  const loadableSelectedCanonicalMap = useAtomValue(selectedCanonicalMapAtomLoadable);
  const selectedCanonicalMap =
    loadableSelectedCanonicalMap.state === 'hasData' ? loadableSelectedCanonicalMap.data : null;
  const isLoading = loadableSelectedCanonicalMap.state === 'loading';

  let body = null;

  useLiteratureCleanNavigate();

  if (isLoading) {
    body = <div className={baseBannerStyle}>Loading...</div>;
  } else if (!selectedMModelId || !selectedRegion || !selectedCanonicalMap) {
    body = <div className={baseBannerStyle}>Select region and M-Type</div>;
  } else {
    const isCanonical = selectedCanonicalMap.get(
      generateBrainRegionMTypeMapKey(selectedRegion.id, selectedMModelId)
    );

    if (!isCanonical) {
      body = <div className={baseBannerStyle}>Placeholder model</div>;
    } else {
      body = (
        <div className="m-5 flex">
          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <ParametersContainer />
            <SynthesisPreview className="relative ml-5 flex h-[80vh] flex-grow overflow-y-auto" />
          </ErrorBoundary>
        </div>
      );
    }
  }

  return body;
}
