import { useState, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import debounce from 'lodash/debounce';

import ConfigList from './ConfigList';
import { searchStringAtom } from '@/components/BrainConfigLoaderView/state';
import Link from '@/components/Link';
import { classNames } from '@/util/utils';
import { BrainModelConfigResource } from '@/types/nexus';

const expDesBaseUrl = '/experiment-designer/experiment-setup';

export default function BrainConfigSelector() {
  const setSearchString = useSetAtom(searchStringAtom);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [expDesUrl, setExpDesUrl] = useState('');

  // eslintssss-disable-next-line react-hooks/exhaustive-deps
  const setSearchStringDebounced = useCallback(
    debounce((searchStr: string) => setSearchString(searchStr), 300),
    [setSearchString]
  );

  const setSearch = (searchStr: string) => {
    setSearchInputValue(searchStr);
    setSearchStringDebounced(searchStr);
  };

  const onSelect = (selectedConfig: BrainModelConfigResource) => {
    const id = selectedConfig['@id'].split('/').pop();
    setExpDesUrl(`${expDesBaseUrl}?brainModelConfigId=${id}`);
  };

  return (
    <>
      <div className="flex items-end">
        <span className="grow font-bold text-xl">Assign Circuit</span>
        <input
          type="text"
          className="block border-b border-b-primary-1 placeholder-primary-3 bg-primary-9 h-7 py-5 w-[300px]"
          placeholder="Search circuits..."
          value={searchInputValue}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ConfigList onSelect={onSelect} />

      <Link
        href={expDesUrl}
        className={classNames(
          expDesUrl ? 'bg-secondary-2 ' : 'bg-slate-400 cursor-not-allowed',
          'flex text-white h-12 px-8 fixed bottom-4 right-4 items-center'
        )}
      >
        Confirm
      </Link>
    </>
  );
}
