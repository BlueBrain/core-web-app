import { useState, useMemo, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import debounce from 'lodash/debounce';
import { loadable } from 'jotai/utils';

import ConfigList from '@/components/ConfigList';
import { builtConfigListAtom, searchConfigListStringAtom } from '@/state/brain-model-config-list';
import { BrainModelConfigResource } from '@/types/nexus';

type Props = {
  onSelect: (modelConfig: BrainModelConfigResource) => void;
};

const loadableConfigListAtom = loadable(builtConfigListAtom);

export default function BrainConfigSelector({ onSelect }: Props) {
  const setSearchString = useSetAtom(searchConfigListStringAtom);
  const [searchInputValue, setSearchInputValue] = useState('');

  const setSearchStringDebounced = useMemo(
    () => debounce((searchStr: string) => setSearchString(searchStr), 300),
    [setSearchString]
  );

  const setSearch = (searchStr: string) => {
    setSearchInputValue(searchStr);
    setSearchStringDebounced(searchStr);
  };

  useEffect(() => {
    setSearchString('');
  }, [setSearchString]);

  const configsLoadable = useAtomValue(loadableConfigListAtom);

  const [configs, setConfigs] = useState<BrainModelConfigResource[]>([]);

  useEffect(() => {
    if (configsLoadable.state !== 'hasData') return;

    setConfigs(configsLoadable.data);
  }, [configsLoadable]);

  return (
    <>
      <div className="flex items-end">
        <span className="grow text-xl font-bold">Assign Circuit</span>
        <input
          type="text"
          className="block h-7 w-[300px] border-b border-b-primary-1 bg-primary-9 py-5 placeholder-primary-3"
          placeholder="Search circuits..."
          value={searchInputValue}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ConfigList<BrainModelConfigResource>
        configs={configs}
        isLoading={configsLoadable.state === 'loading'}
        rowSelection={{
          type: 'radio',
          onSelect,
        }}
        rowClassName="text-primary-4"
      />
    </>
  );
}
