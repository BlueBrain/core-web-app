import { useState } from 'react';
import { useSetAtom } from 'jotai';

import ConfigList from './ConfigList';
import { searchConfigListStringAtom } from '@/state/brain-model-config-list';
import { BrainModelConfigResource } from '@/types/nexus';

type Props = {
  onSelect: (modelConfig: BrainModelConfigResource) => void;
};

export default function BrainConfigSelector({ onSelect }: Props) {
  const setSearchString = useSetAtom(searchConfigListStringAtom);
  const [searchInputValue, setSearchInputValue] = useState('');

  const setSearch = (searchStr: string) => {
    setSearchInputValue(searchStr);
    setSearchString(searchStr);
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
    </>
  );
}
