import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { searchStringAtom } from '@/state/explore-section/list-view-atoms';
import style from '@/components/explore-section/search.module.scss';

const { Search } = Input;

export default function ExploreSectionNameSearch() {
  const [openSearchInput, setOpenSearchInputOpen] = useState<boolean>(false);
  const [searchString, setSearchString] = useAtom(searchStringAtom);

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

  return openSearchInput ? (
    <Search
      allowClear
      size="large"
      placeholder={searchString}
      onSearch={(value: string) => setSearchString(value)}
      className={style.search}
      enterButton={<SearchOutlined />}
    />
  ) : (
    <button
      type="button"
      className={style.searchButton}
      onClick={() => setOpenSearchInputOpen(!openSearchInput)}
    >
      <SearchOutlined />
    </button>
  );
}
