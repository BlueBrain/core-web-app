import { useAtomValue } from 'jotai';

import { ListItem, ETypeEntry } from '.';
import { analysedETypesAtom } from '@/state/build-composition';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { eModelByETypeMappingAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';

export default function List() {
  const mEModelItems = useAtomValue(analysedETypesAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const eModels = useAtomValue(eModelByETypeMappingAtom);

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
          />
        ))}
      </>
    );
  }

  return <div className="flex flex-col items-stretch">{listItems}</div>;
}
