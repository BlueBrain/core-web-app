import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import lodashMap from 'lodash/map';
import omit from 'lodash/omit';
import intersection from 'lodash/intersection';
import { unwrap } from 'jotai/utils';

import {
  dataBrainRegionsAtom,
  selectedBrainRegionAtom,
  selectedBrainRegionsWithChildrenAtom,
} from '@/state/brain-regions';
import { sectionAtom } from '@/state/application';
import { getBrainRegionDescendants } from '@/state/brain-regions/descendants';

export function useCollectExperimentalData() {
  const sectionName = useAtomValue(sectionAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const [dataBrainRegions, setDataBrainRegions] = useAtom(dataBrainRegionsAtom);
  const id = selectedBrainRegion?.id;
  const brainRegions = useAtomValue(
    useMemo(() => unwrap(getBrainRegionDescendants(id ? [id] : [])), [id])
  );
  const selectedBrainRegionsAndChildren = useAtomValue(selectedBrainRegionsWithChildrenAtom);

  useEffect(() => {
    if (!selectedBrainRegion || !id || !dataBrainRegions || !brainRegions) return;
    if (dataBrainRegions?.[id]) return;
    if (sectionName !== 'explore') return;

    const childrenOfCurrent = lodashMap(brainRegions, 'id');

    let updatedDataBrainRegions: Record<string, string[]>;

    if (selectedBrainRegionsAndChildren.includes(id)) {
      const brainRegionsToRemove = [id, ...childrenOfCurrent];

      // Remove manually selected brainRegions
      updatedDataBrainRegions = omit(dataBrainRegions, brainRegionsToRemove);

      // Remove automatically selected brainRegions (which are present inside the arrays of `dataBrainRegions`)
      Object.entries(updatedDataBrainRegions).forEach(([parent, children]) => {
        if (intersection(children, brainRegionsToRemove).length > 0) {
          updatedDataBrainRegions[parent] = children.filter(
            (child) => !brainRegionsToRemove.includes(child)
          );
        }
      });
    } else {
      updatedDataBrainRegions = { [id]: [...childrenOfCurrent] };
    }

    setDataBrainRegions(updatedDataBrainRegions);
  }, [
    selectedBrainRegion,
    brainRegions,
    dataBrainRegions,
    id,
    selectedBrainRegionsAndChildren,
    setDataBrainRegions,
    sectionName,
  ]);
}
