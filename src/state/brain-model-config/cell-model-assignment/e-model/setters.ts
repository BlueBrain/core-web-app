import { atom } from 'jotai';
import debounce from 'lodash/debounce';

import {
  assembledEModelUIConfigAtom,
  eModelUIConfigAtom,
  editedEModelByETypeMappingAtom,
  refetchTriggerAtom,
  reloadListOfOptimizationsAtom,
  selectedEModelAtom,
} from '.';
import { EModelOptimizationConfig } from '@/types/e-model';
import { createJsonFile, createResource } from '@/api/nexus';
import sessionAtom from '@/state/session';
import { EntityCreation } from '@/types/nexus';
import { createDistribution } from '@/util/nexus';
import { autoSaveDebounceInterval } from '@/config';

export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

const createOptimizationConfigAtom = atom(null, async (get) => {
  const session = get(sessionAtom);
  const eModelUIConfig = await get(assembledEModelUIConfigAtom);

  if (!session || !eModelUIConfig) return null;

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

  return createResource(clonedConfig, session);
});

const triggerCreateDebouncedAtom = atom<null, [], Promise<void>>(
  null,
  debounce((get, set) => set(createOptimizationConfigAtom), autoSaveDebounceInterval)
);

export const createEModelOptimizationConfigAtom = atom<null, [], void>(null, (get, set) => {
  set(triggerCreateDebouncedAtom);
});

export const cloneEModelConfigAtom = atom<null, [], void>(null, async (get, set) => {
  const assembledEModelUIConfig = await get(assembledEModelUIConfigAtom);
  if (!assembledEModelUIConfig) return null;

  set(eModelUIConfigAtom, assembledEModelUIConfig);
  const eModelResource = await set(createOptimizationConfigAtom);

  if (!eModelResource) throw new Error('Error cloning the e-model config');

  set(reloadListOfOptimizationsAtom, {});
  await get(editedEModelByETypeMappingAtom);

  set(selectedEModelAtom, {
    eType: assembledEModelUIConfig.eType,
    id: eModelResource?.['@id'],
    isOptimizationConfig: true,
    mType: assembledEModelUIConfig.mType,
    name: assembledEModelUIConfig.name,
  });
  return eModelResource;
});
