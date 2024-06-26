import { useAtomValue } from 'jotai';

import { ListItem, ETypeEntry } from '.';
import { analysedETypesAtom } from '@/state/build-composition';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import {
  eModelByETypeMappingAtom,
  editedEModelByETypeMappingAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { mergeEModelsAndOptimizations } from '@/services/e-model';

export default function List() {
  const mEModelItems = useAtomValue(analysedETypesAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const optimizations = useAtomValue(eModelByETypeMappingAtom);
  const eModels = useAtomValue(editedEModelByETypeMappingAtom);
  const selectedEModel = useAtomValue(selectedEModelAtom);

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
            eTypeEntryComponent={ETypeEntry}
            selectedMTypeName={selectedEModel?.mType}
          />
        ))}
      </>
    );
  }

  return <div className="flex flex-col items-stretch">{listItems}</div>;
}
