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

export function useResetMModel() {
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const setSelectedMModelName = useSetAtom(selectedMModelNameAtom);
  const setSelectedMModelId = useSetAtom(selectedMModelIdAtom);
  const setMModelRemoteOverridesLoaded = useSetAtom(mModelRemoteParamsLoadedAtom);

  useEffect(() => {
    // resetting the m-type state and localStorage when brain region changes
    if (!selectedBrainRegion) return;

    const savedMModelStr = window.localStorage.getItem(DEFAULT_M_MODEL_STORAGE_KEY);
    const savedMModel = JSON.parse(savedMModelStr || 'null');

    if (!savedMModel || savedMModel.value.brainRegionId === selectedBrainRegion.id) return;

    setSelectedMModelName(null);
    setSelectedMModelId(null);
    setMModelRemoteOverridesLoaded(false);

    window.localStorage.setItem(DEFAULT_M_MODEL_STORAGE_KEY, 'null');
  }, [
    selectedBrainRegion,
    setSelectedMModelName,
    setSelectedMModelId,
    setMModelRemoteOverridesLoaded,
  ]);
}
