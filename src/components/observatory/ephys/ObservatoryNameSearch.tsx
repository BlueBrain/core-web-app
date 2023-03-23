import { PrimitiveAtom, useAtom } from 'jotai';
import { Input } from 'antd';

const { Search } = Input;

type ObservatoryNameSearchProps = {
  searchStringAtom: PrimitiveAtom<string>;
};

export default function ObservatoryNameSearch({ searchStringAtom }: ObservatoryNameSearchProps) {
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
