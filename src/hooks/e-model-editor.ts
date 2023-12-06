'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import {
  eModelRemoteParamsLoadedAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { DEFAULT_E_MODEL_STORAGE_KEY } from '@/constants/cell-model-assignment/e-model';

export function useResetEModel() {
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const setSelectedEModel = useSetAtom(selectedEModelAtom);
  const setEModelRemoteOverridesLoaded = useSetAtom(eModelRemoteParamsLoadedAtom);

  useEffect(() => {
    // resetting the m-type localStorage when brain region changes
    if (!selectedBrainRegion) return;

    const savedEModelStr = window.localStorage.getItem(DEFAULT_E_MODEL_STORAGE_KEY);
    const savedEModel = JSON.parse(savedEModelStr || 'null');

    if (!savedEModel || savedEModel.brainRegionId === selectedBrainRegion.id) return;

    // resetting the m-type selection when brain region changes
    setSelectedEModel(null);
    setEModelRemoteOverridesLoaded(false);

    window.localStorage.setItem(DEFAULT_E_MODEL_STORAGE_KEY, 'null');
  }, [selectedBrainRegion, setSelectedEModel, setEModelRemoteOverridesLoaded]);
}
