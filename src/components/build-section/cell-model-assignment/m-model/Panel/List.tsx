import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';

import ListItem from './ListItem';
import { analysedMTypesAtom } from '@/state/build-composition';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import {
  canonicalBrainRegionMTypeMapAtom,
  selectedCanonicalMapAtom,
} from '@/state/brain-model-config/cell-model-assignment/m-model';
import { generateBrainRegionMTypeMapKey } from '@/util/cell-model-assignment';
import { ModelChoice } from '@/types/m-model';
import { setAccumulativeTopologicalSynthesisAtom } from '@/state/brain-model-config/cell-model-assignment/m-model/setters';

const canonicalMapAtomLoadable = loadable(canonicalBrainRegionMTypeMapAtom);
const selectedCanonicalMapAtomLoadable = loadable(selectedCanonicalMapAtom);

export default function List() {
  const mModelItems = useAtomValue(analysedMTypesAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const loadableSelectedCanonicalMap = useAtomValue(selectedCanonicalMapAtomLoadable);
  const selectedCanonicalMap =
    loadableSelectedCanonicalMap.state === 'hasData' ? loadableSelectedCanonicalMap.data : null;
  const setAccumulativeTopologicalSynthesis = useSetAtom(setAccumulativeTopologicalSynthesisAtom);
  const loadableCanonicalMap = useAtomValue(canonicalMapAtomLoadable);
  const canonicalMap = loadableCanonicalMap.state === 'hasData' ? loadableCanonicalMap.data : null;

  let listItems = null;

  if (selectedBrainRegion && canonicalMap && selectedCanonicalMap) {
    const onModelChange = (mTypeId: string, modelChoice: ModelChoice) => {
      setAccumulativeTopologicalSynthesis(
        selectedBrainRegion.id,
        mTypeId,
        modelChoice === 'placeholder' ? 'remove' : 'add'
      );
    };

    listItems = (
      <>
        {mModelItems.map((item) => {
          const regionMTypeKey = generateBrainRegionMTypeMapKey(selectedBrainRegion.id, item.id);
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
