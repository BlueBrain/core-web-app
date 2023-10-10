'use client';

import { useAtomValue } from 'jotai';

import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import MEModelView from '@/components/build-section/cell-model-assignment/me-model/MEModelView';
import CloneConfigButton from '@/components/build-section/cell-model-assignment/me-model/CloneConfigButton';

const baseBannerStyle = 'flex h-full items-center justify-center text-4xl';

export default function ConfigurationPage() {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const selectedRegion = useAtomValue(selectedBrainRegionAtom);

  let body = null;

  if (!selectedEModel || !selectedRegion) {
    body = <div className={baseBannerStyle}>Select region and E-Model</div>;
  } else {
    body = (
      <div>
        <MEModelView />
        <CloneConfigButton />
      </div>
    );
  }

  return body;
}
