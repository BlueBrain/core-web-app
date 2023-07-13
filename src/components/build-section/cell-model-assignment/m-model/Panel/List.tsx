import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import filter from 'lodash/filter';

import ListItem from './ListItem';
import { analysedCompositionAtom } from '@/state/build-composition';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { selectedCanonicalMapAtom } from '@/state/brain-model-config/cell-model-assignment/m-model';
import { expandBrainRegionId } from '@/util/cell-model-assignment';

interface MModelMenuItem {
  label: string;
  annotation?: string;
  id: string;
}

export default function List() {
  const composition = useAtomValue(analysedCompositionAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const selectedCanonicalMap = useAtomValue(selectedCanonicalMapAtom);

  const mModelItems: MModelMenuItem[] = useMemo(
    () =>
      composition !== null
        ? filter(composition.nodes, { about: 'MType' }).map((node) => ({
            label: node.label,
            id: node.id,
          }))
        : [],
    [composition]
  );

  let listItems = null;

  if (selectedBrainRegion) {
    const expandedBrainRegionId = expandBrainRegionId(selectedBrainRegion.id);
    listItems = (
      <>
        {mModelItems.map((item) => {
          const isCanonical = selectedCanonicalMap.get(`${expandedBrainRegionId}<>${item.id}`);
          const activeModel = isCanonical ? `canonical_${item.label}` : 'placeholder';
          return (
            <ListItem key={item.label} label={item.label} id={item.id} activeModel={activeModel} />
          );
        })}
      </>
    );
  }

  return <div className="flex flex-col items-stretch">{listItems}</div>;
}
