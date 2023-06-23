import { useMemo } from 'react';

import MModelListItem from './MModelListItem';

const mModelItems: { name: string; annotation?: string }[] = [
  { name: 'BP' },
  { name: 'LBC', annotation: 'Not assigned' },
  { name: 'NGC', annotation: 'Canonical NGC' },
  { name: 'NBC' },
  { name: 'ChC', annotation: 'Not assigned' },
  { name: 'BTC' },
  { name: 'PC' },
  { name: 'MC' },
];

export default function MModelList() {
  const listItems = useMemo(
    () => (
      <>
        {mModelItems.map((item) => (
          <MModelListItem key={item.name} name={item.name} annotation={item.annotation} />
        ))}
      </>
    ),
    []
  );

  return <div className="flex flex-col items-stretch">{listItems}</div>;
}
