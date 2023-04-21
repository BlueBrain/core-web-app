import { PrimitiveAtom, useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import style from '@/components/explore-section/search.module.scss';

const { Search } = Input;

type ExploreSectionNameSearchProps = {
  searchStringAtom: PrimitiveAtom<string>;
};

export default function ExploreSectionNameSearch({
  searchStringAtom,
}: ExploreSectionNameSearchProps) {
  const [searchString, setSearchString] = useAtom(searchStringAtom);
  const [openSearchInput, setOpenSearchInputOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && openSearchInput) {
        setOpenSearchInputOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [openSearchInput]);

  return (
    <div>
      {openSearchInput ? (
        <Search
          allowClear
          size="large"
          placeholder={searchString}
          onSearch={(value: string) => setSearchString(value)}
          className={style.search}
          enterButton={<SearchOutlined />}
        />
      ) : (
        <Button
          className={style.searchButton}
          onClick={() => setOpenSearchInputOpen(!openSearchInput)}
          icon={<SearchOutlined />}
        />
      )}
    </div>
  );
}
