import { useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import filter from 'lodash/filter';
import { loadable } from 'jotai/utils';

import ListItem from './ListItem';
import { analysedCompositionAtom } from '@/state/build-composition';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import {
  canonicalMapAtom,
  selectedCanonicalMapAtom,
} from '@/state/brain-model-config/cell-model-assignment/m-model';
import { expandBrainRegionId, generateBrainMTypeMapKey } from '@/util/cell-model-assignment';
import { ModelChoice } from '@/types/m-model';
import { setAccumulativeTopologicalSynthesisAtom } from '@/state/brain-model-config/cell-model-assignment/m-model/setters';

const canonicalMapAtomLoadable = loadable(canonicalMapAtom);

interface MModelMenuItem {
  label: string;
  annotation?: string;
  id: string;
}

export default function List() {
  const composition = useAtomValue(analysedCompositionAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const selectedCanonicalMap = useAtomValue(selectedCanonicalMapAtom);
  const setAccumulativeTopologicalSynthesis = useSetAtom(setAccumulativeTopologicalSynthesisAtom);
  const loadableCanonicalMap = useAtomValue(canonicalMapAtomLoadable);
  const canonicalMap = loadableCanonicalMap.state === 'hasData' ? loadableCanonicalMap.data : null;

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

  if (selectedBrainRegion && canonicalMap) {
    const expandedBrainRegionId = expandBrainRegionId(selectedBrainRegion.id);

    const onModelChange = (mTypeId: string, modelChoice: ModelChoice) => {
      setAccumulativeTopologicalSynthesis(
        expandedBrainRegionId,
        mTypeId,
        modelChoice === 'placeholder' ? 'remove' : 'add'
      );
    };

    listItems = (
      <>
        {mModelItems.map((item) => {
          const regionMTypeKey = generateBrainMTypeMapKey(expandedBrainRegionId, item.id);
          const hasCanonical = canonicalMap.get(regionMTypeKey);
          const isCanonical = hasCanonical && !!selectedCanonicalMap.get(regionMTypeKey);
          const activeModel = isCanonical ? `canonical_${item.label}` : 'placeholder';

          return (
            <ListItem
              key={item.label}
              label={item.label}
              id={item.id}
              activeModel={activeModel}
              onModelChange={onModelChange}
              onlyPlaceholder={!hasCanonical}
            />
          );
        })}
      </>
    );
  }

  return <div className="flex flex-col items-stretch">{listItems}</div>;
}
