import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import {
  DEFAULT_ME_MODEL_STORAGE_KEY,
  featureWithEModel,
} from '@/constants/cell-model-assignment/me-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import {
  featureWithEModelAtom,
  localConfigPayloadAtom,
  remoteConfigPayloadAtom,
  selectedMENameAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/me-model';
import { DefaultMEModelType } from '@/types/me-model';
import { getInitializationValue, setInitializationValue } from '@/util/utils';

export function useInitializeFeatures() {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const selectedRegion = useAtomValue(selectedBrainRegionAtom);

  const setFeatureWithEModel = useSetAtom(featureWithEModelAtom);

  useEffect(() => {
    setFeatureWithEModel(featureWithEModel);
  }, [selectedEModel, selectedRegion, setFeatureWithEModel]);
}

export function useInitializeLocalPayload() {
  const remoteConfigPayload = useAtomValue(remoteConfigPayloadAtom);
  const setLocalConfigPayload = useSetAtom(localConfigPayloadAtom);

  useEffect(() => {
    if (!remoteConfigPayload) return;

    setLocalConfigPayload(remoteConfigPayload);
  }, [remoteConfigPayload, setLocalConfigPayload]);
}

export function useResetMEModel() {
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const setSelectedMEName = useSetAtom(selectedMENameAtom);
  const setSelectedEModel = useSetAtom(selectedEModelAtom);

  useEffect(() => {
    // resetting the m-type localStorage when brain region changes
    if (!selectedBrainRegion) return;

    const savedMEModel = getInitializationValue<DefaultMEModelType>(DEFAULT_ME_MODEL_STORAGE_KEY);

    if (!savedMEModel || savedMEModel.brainRegionId === selectedBrainRegion.id) return;

    // resetting the me-type selection when brain region changes
    setSelectedEModel(null);
    setSelectedMEName([null, null]);

    setInitializationValue(DEFAULT_ME_MODEL_STORAGE_KEY, 'null');
  }, [selectedBrainRegion, setSelectedEModel, setSelectedMEName]);
}
