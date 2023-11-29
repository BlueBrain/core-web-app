import { useAtomValue } from 'jotai';

import { ListItem, ETypeEntry } from '.';
import { analysedETypesAtom } from '@/state/build-composition';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { eModelByETypeMappingAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { selectedMENameAtom } from '@/state/brain-model-config/cell-model-assignment/me-model';

export default function List() {
  const mEModelItems = useAtomValue(analysedETypesAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const eModels = useAtomValue(eModelByETypeMappingAtom);
  const selectedMEName = useAtomValue(selectedMENameAtom);

  let listItems = null;

  if (selectedBrainRegion) {
    listItems = (
      <>
        {Object.entries(mEModelItems).map(([mTypeName, { eTypeInfo }]) => (
          <ListItem
            key={mTypeName}
            eTypeItems={eTypeInfo}
            mTypeName={mTypeName}
            eModelByETypeMapping={eModels}
            eTypeEntryComponent={ETypeEntry}
            selectedMTypeName={selectedMEName?.[0] || undefined}
          />
        ))}
      </>
    );
  }

  return <div className="flex flex-col items-stretch">{listItems}</div>;
}
