'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';

import {
  selectedMModelNameAtom,
  mModelGetRemoteConfigAtom,
} from '@/state/brain-model-config/cell-model-assignment';

export default function useMModelQueryParam() {
  const [currentMModelName, setMModelName] = useAtom(selectedMModelNameAtom);

  const searchParams = useSearchParams();
  const mModelName = searchParams?.get('mModel');

  useEffect(() => {
    if (currentMModelName !== null) return;
    if (!mModelName || currentMModelName === mModelName) return;

    setMModelName(mModelName);
  }, [mModelName, currentMModelName, setMModelName]);
}

export function useFetchMModelConfig() {
  const mModelGetRemoteConfig = useSetAtom(mModelGetRemoteConfigAtom);
  mModelGetRemoteConfig();
}
