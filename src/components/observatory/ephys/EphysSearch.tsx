import { useAtom } from 'jotai/react';
import { Input } from 'antd';
import { searchStringAtom } from '@/state/ephys';

const { Search } = Input;

export default function EphysSearch() {
  const [searchString, setSearchString] = useAtom(searchStringAtom);
  return (
    <Search
      allowClear
      size="large"
      placeholder={searchString}
      onSearch={(value: string) => setSearchString(value)}
      className="bg-primary-7 border-none bg-transparent"
      enterButton="Search"
    />
  );
}
