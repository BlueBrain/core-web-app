import { atom } from 'jotai';
import debounce from 'lodash/debounce';

import { eModelUIConfigAtom, refetchTriggerAtom } from '.';
import { EModelOptimizationConfig, EModelUIConfig } from '@/types/e-model';
import { createJsonFile, createResource } from '@/api/nexus';
import sessionAtom from '@/state/session';
import { EntityCreation } from '@/types/nexus';
import { createDistribution } from '@/util/nexus';
import { autoSaveDebounceInterval } from '@/config';

export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

const createEModelOptimizationConfigAtom = atom(null, async (get) => {
  const session = get(sessionAtom);
  const eModelUIConfig = get(eModelUIConfigAtom) as EModelUIConfig | null;

  if (!session || !eModelUIConfig) return;

  const updatedFile = await createJsonFile(
    eModelUIConfig,
    'emodel-optimization-config.json',
    session
  );

  const clonedConfig: EntityCreation<EModelOptimizationConfig> = {
    '@type': ['Entity', 'EModelOptimizationConfig'],
    '@context': 'https://bbp.neuroshapes.org',
    distribution: createDistribution(updatedFile),
    name: eModelUIConfig.name,
    eType: eModelUIConfig.eType,
    mType: eModelUIConfig.mType,
    brainLocation: {
      '@type': 'BrainLocation',
      brainRegion: {
        '@id': eModelUIConfig.brainRegionId,
        label: eModelUIConfig.brainRegionName,
      },
    },
  };

  await createResource(clonedConfig, session);
});

const triggerCreateDebouncedAtom = atom<null, [], Promise<void>>(
  null,
  debounce((get, set) => set(createEModelOptimizationConfigAtom), autoSaveDebounceInterval)
);

export const saveEModelOptimizationConfigAtom = atom<null, [], void>(null, (get, set) => {
  set(triggerCreateDebouncedAtom);
});
