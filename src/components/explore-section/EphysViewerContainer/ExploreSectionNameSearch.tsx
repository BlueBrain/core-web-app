import { Dispatch, useState, useEffect } from 'react';
import { SetStateAction } from 'jotai';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import style from '@/components/explore-section/search.module.scss';

const { Search } = Input;

type ExploreSectionNameSearchProps = {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
};

export default function ExploreSectionNameSearch({
  searchString,
  setSearchString,
}: ExploreSectionNameSearchProps) {
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
