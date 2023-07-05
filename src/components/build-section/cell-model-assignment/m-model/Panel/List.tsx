import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import filter from 'lodash/filter';

import MModelListItem from './ListItem';
import { analysedCompositionAtom } from '@/state/build-composition';

interface MModelMenuItem {
  label: string;
  annotation?: string;
}

export default function List() {
  const composition = useAtomValue(analysedCompositionAtom);

  const mModelItems: MModelMenuItem[] = useMemo(
    () =>
      composition !== null
        ? filter(composition.nodes, { about: 'MType' }).map((node) => ({
            label: node.label,
            annotation: `Canonical ${node.label}`,
          }))
        : [],
    [composition]
  );

  const listItems = useMemo(
    () => (
      <>
        {mModelItems.map((item) => (
          <MModelListItem key={item.label} label={item.label} annotation={item.annotation} />
        ))}
      </>
    ),
    [mModelItems]
  );

  return <div className="flex flex-col items-stretch">{listItems}</div>;
}
