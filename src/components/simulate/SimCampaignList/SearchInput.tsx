import { useState, useEffect, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import debounce from 'lodash/debounce';

import { searchSimCampUIConfigListStringAtom } from '@/state/simulate';

export default function SearchInput() {
  const setSearchString = useSetAtom(searchSimCampUIConfigListStringAtom);
  const [searchInputValue, setSearchInputValue] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setSearchStringDebounced = useCallback(
    debounce((searchStr: string) => setSearchString(searchStr), 300),
    [setSearchString]
  );

  const setSearch = (searchStr: string) => {
    setSearchInputValue(searchStr);
    setSearchStringDebounced(searchStr);
  };

  useEffect(() => {
    setSearchString('');
  }, []);

  return (
    <input
      type="text"
      className="block border-b border-b-primary-1 placeholder-primary-3 bg-primary-9 h-7 py-5 w-[300px]"
      placeholder="Search simulation campaign configs..."
      value={searchInputValue}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
