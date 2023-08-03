import { useAtomValue } from 'jotai';

import ListItem from './ListItem';
import { analysedETypesAtom } from '@/state/build-composition';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

export default function List() {
  const eModelItems = useAtomValue(analysedETypesAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);

  let listItems = null;

  if (selectedBrainRegion) {
    listItems = (
      <>
        {eModelItems.map((item) => (
          <ListItem key={item.uuid} item={item} />
        ))}
      </>
    );
  }

  return <div className="flex flex-col items-stretch">{listItems}</div>;
}
