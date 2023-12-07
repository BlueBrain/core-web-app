'use client';

import { useAtomValue } from 'jotai';

import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import EModelView from '@/components/build-section/cell-model-assignment/e-model/EModelView';
import CloneConfigButton from '@/components/build-section/cell-model-assignment/e-model/CloneConfigButton';
import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';
import EditConfigButton from '@/components/build-section/cell-model-assignment/e-model/EditConfigButton';
import { useSessionAtomValue } from '@/hooks/hooks';

const baseBannerStyle = 'flex h-full items-center justify-center text-4xl';

export default function ConfigurationPage() {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const selectedRegion = useAtomValue(selectedBrainRegionAtom);
  const session = useSessionAtomValue();

  let body = null;

  useLiteratureCleanNavigate();

  if (!session || !selectedEModel || !selectedRegion) {
    body = <div className={baseBannerStyle}>Select region and E-Type</div>;
  } else {
    body = (
      <div>
        <EModelView />
        {selectedEModel.isOptimizationConfig ? <EditConfigButton /> : <CloneConfigButton />}
      </div>
    );
  }

  return body;
}
