'use client';

import { useAtomValue } from 'jotai';

import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/me-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import MEModelView from '@/components/build-section/cell-model-assignment/me-model/MEModelView';
import { useInitializeFeatures, useInitializeLocalPayload } from '@/hooks/me-model-editor';
import { useSessionAtomValue } from '@/hooks/hooks';

const baseBannerStyle = 'flex h-full items-center justify-center text-4xl';

export default function ConfigurationPage() {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const selectedRegion = useAtomValue(selectedBrainRegionAtom);
  const session = useSessionAtomValue();

  useInitializeFeatures();
  useInitializeLocalPayload();

  if (!session || !selectedEModel || !selectedRegion) {
    return <div className={baseBannerStyle}>Select region and E-Model</div>;
  }

  return <MEModelView />;
}
