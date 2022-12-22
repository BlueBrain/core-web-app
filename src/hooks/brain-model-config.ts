'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';

import { idAtom, addRecentlyUsedConfigIdAtom } from '@/state/brain-model-config';
import { expandId } from '@/util/nexus';

export default function useBrainModelConfig() {
  const [currentId, setId] = useAtom(idAtom);
  const addRecentlyUsedConfig = useSetAtom(addRecentlyUsedConfigIdAtom);

  const searchParams = useSearchParams();
  const collapsedId = searchParams.get('brainModelConfigId');
  const id = collapsedId ? expandId(collapsedId) : null;

  useEffect(() => {
    if (id && currentId !== id) {
      setId(id);
      addRecentlyUsedConfig(id);
    }
  }, [id, currentId, setId, addRecentlyUsedConfig]);
}
