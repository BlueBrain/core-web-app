import { useCallback, startTransition } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import find from 'lodash/find';

import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import {
  selectedBrainRegionAtom,
  brainRegionHierarchyStateAtom,
  brainRegionsAtom,
} from '@/state/brain-regions';
import { generateHierarchyPathTree, getAncestors } from '@/components/BrainTree/util';
import { setInitializationValue } from '@/util/utils';
import { DEFAULT_E_MODEL_STORAGE_KEY } from '@/constants/cell-model-assignment/e-model';

/**
 * Navigates the application to the build E-model configuration page
 * Update the brain region and the tree hierarchy to the corresponding emodel config
 */

export default function useNavigateToBuildEmodelConfiguration() {
  const { push: navigate } = useRouter();
  const params = useSearchParams();
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const brainRegions = useAtomValue(brainRegionsAtom);
  const setSelectedBrainRegion = useSetAtom(selectedBrainRegionAtom);
  const setBrainRegionHierarchyState = useSetAtom(brainRegionHierarchyStateAtom);

  return useCallback(() => {
    if (selectedEModel) {
      const brainRegionId = selectedEModel.brainRegion;
      if (brainRegionId) {
        const brainRegion = find(brainRegions, ['id', brainRegionId]);
        const allAncestors = getAncestors(brainRegions ?? [], brainRegionId);
        const newHierarchyTree = generateHierarchyPathTree(
          allAncestors.map((entry) => Object.keys(entry)[0])
        );

        startTransition(() => {
          setBrainRegionHierarchyState(newHierarchyTree);
          setSelectedBrainRegion({
            id: brainRegionId,
            leaves: brainRegion?.leaves || null,
            title: brainRegion?.title ?? '',
          });
          setInitializationValue(DEFAULT_E_MODEL_STORAGE_KEY, {
            value: selectedEModel,
            brainRegionId,
          });
        });

        const buildUrl = `/build/cell-model-assignment/e-model/configuration?${params.toString()}`;
        navigate(buildUrl);
      }
    }
  }, [
    params,
    navigate,
    brainRegions,
    selectedEModel,
    setSelectedBrainRegion,
    setBrainRegionHierarchyState,
  ]);
}
