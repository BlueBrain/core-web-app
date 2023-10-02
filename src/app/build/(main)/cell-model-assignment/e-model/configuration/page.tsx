'use client';

import { useAtomValue } from 'jotai';

import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import EModelView from '@/components/build-section/cell-model-assignment/e-model/EModelView';
import EditEModelButton from '@/components/build-section/cell-model-assignment/e-model/EditEModelButton';
import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';

const baseBannerStyle = 'flex h-full items-center justify-center text-4xl';

export default function ConfigurationPage() {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const selectedRegion = useAtomValue(selectedBrainRegionAtom);

  let body = null;

  useLiteratureCleanNavigate();

  if (!selectedEModel || !selectedRegion) {
    body = <div className={baseBannerStyle}>Select region and E-Type</div>;
  } else {
    body = (
      <div>
        <EModelView />
        <EditEModelButton />
      </div>
    );
  }

  return body;
}
