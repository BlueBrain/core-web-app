import { useAtomValue } from 'jotai';

import ListItem from './ListItem';
import { analysedETypesAtom } from '@/state/build-composition';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { eModelByETypeMappingAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';

export default function List() {
  const mEModelItems = useAtomValue(analysedETypesAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const eModelByETypeMapping = useAtomValue(eModelByETypeMappingAtom);

  let listItems = null;

  if (selectedBrainRegion) {
    listItems = (
      <>
        {Object.entries(mEModelItems).map(([mTypeName, eTypes]) => (
          <ListItem
            key={mTypeName}
            eTypeItems={eTypes}
            mTypeName={mTypeName}
            eModelByETypeMapping={eModelByETypeMapping}
          />
        ))}
      </>
    );
  }

  return <div className="flex flex-col items-stretch">{listItems}</div>;
}
