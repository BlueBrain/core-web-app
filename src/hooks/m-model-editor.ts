'use client';

import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import {
  mModelRemoteParamsLoadedAtom,
  selectedMModelIdAtom,
  selectedMModelNameAtom,
} from '@/state/brain-model-config/cell-model-assignment/m-model';
import { DEFAULT_M_MODEL_STORAGE_KEY } from '@/constants/cell-model-assignment/m-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { getInitializationValue, setInitializationValue } from '@/util/utils';
import { DefaultMModelType } from '@/types/m-model';

export function useResetMModel() {
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const setSelectedMModelName = useSetAtom(selectedMModelNameAtom);
  const setSelectedMModelId = useSetAtom(selectedMModelIdAtom);
  const setMModelRemoteOverridesLoaded = useSetAtom(mModelRemoteParamsLoadedAtom);

  useEffect(() => {
    // resetting the m-type state and localStorage when brain region changes
    if (!selectedBrainRegion) return;

    const savedMModel = getInitializationValue<DefaultMModelType>(DEFAULT_M_MODEL_STORAGE_KEY);

    if (!savedMModel || savedMModel.value.brainRegionId === selectedBrainRegion.id) return;

    setSelectedMModelName(null);
    setSelectedMModelId(null);
    setMModelRemoteOverridesLoaded(false);

    setInitializationValue(DEFAULT_M_MODEL_STORAGE_KEY, 'null');
  }, [
    selectedBrainRegion,
    setSelectedMModelName,
    setSelectedMModelId,
    setMModelRemoteOverridesLoaded,
  ]);
}
