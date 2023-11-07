import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { featureWithEModel } from '@/constants/cell-model-assignment/me-model';
import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { featureWithEModelAtom } from '@/state/brain-model-config/cell-model-assignment/me-model';

export function useInitializeFeatures() {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const selectedRegion = useAtomValue(selectedBrainRegionAtom);

  const setFeatureWithEModel = useSetAtom(featureWithEModelAtom);

  useEffect(() => {
    setFeatureWithEModel(featureWithEModel);
  }, [selectedEModel, selectedRegion, setFeatureWithEModel]);
}
