import { useAtomValue } from 'jotai';

import ListItem from './ListItem';
import { analysedETypesAtom } from '@/state/build-composition';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import {
  eModelByETypeMappingAtom,
  editedEModelByETypeMappingAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { mergeEModelsAndOptimizations } from '@/services/e-model';

export default function List() {
  const mEModelItems = useAtomValue(analysedETypesAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const optimizations = useAtomValue(eModelByETypeMappingAtom);
  const eModels = useAtomValue(editedEModelByETypeMappingAtom);

  const eModelByETypeMapping = mergeEModelsAndOptimizations(optimizations, eModels);

  let listItems = null;

  if (selectedBrainRegion) {
    listItems = (
      <>
        {Object.entries(mEModelItems).map(([mTypeName, { eTypeInfo }]) => (
          <ListItem
            key={mTypeName}
            eTypeItems={eTypeInfo}
            mTypeName={mTypeName}
            eModelByETypeMapping={eModelByETypeMapping}
          />
        ))}
      </>
    );
  }

  return <div className="flex flex-col items-stretch">{listItems}</div>;
}
