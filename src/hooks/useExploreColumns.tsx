'use client';

import { Dispatch } from 'react';
import { SetStateAction } from 'jotai';
import { Tooltip } from 'antd';
import { ColumnProps, ColumnType } from 'antd/lib/table';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { SortState } from '@/types/explore-section/application';
import styles from '@/app/explore/explore.module.scss';

const useExploreColumns = (
  keys: string[],
  sortState: SortState,
  setSortState: Dispatch<SetStateAction<SortState>>
): ColumnProps<ExploreSectionResource>[] => {
  const sorterES = (column: ColumnType<ExploreSectionResource>) => {
    const field = column.key;
    if (field) {
      const toggled = sortState.order === 'asc' ? 'desc' : 'asc';
      const order = sortState.field === field ? toggled : 'asc';
      setSortState({ field, order });
    }
  };

  const getHeaderColumn = (key: string) => {
    const term = LISTING_CONFIG[key as keyof typeof LISTING_CONFIG];

    if (!term) {
      return <div className={styles.tableHeader}>{key}</div>;
    }

    const isSorted = key === sortState.field;

    const iconDirection =
      sortState.order === 'asc' ? (
        <CaretUpOutlined className="flex mr-2" />
      ) : (
        <CaretDownOutlined className="flex mr-2" />
      );

    const icon = isSorted ? (
      iconDirection
    ) : (
      <div className={styles.sortIcons}>
        <CaretUpOutlined />
        <CaretDownOutlined />
      </div>
    );

    return (
      <div className={styles.tableHeader}>
        {icon}
        <Tooltip title={term.description ? term.description : term.title}>{term.title}</Tooltip>
      </div>
    );
  };

  const columns: ColumnProps<ExploreSectionResource>[] = [
    {
      title: getHeaderColumn('#'),
      key: 'index',
      className: 'text-primary-7',
      width: 75,
      render: (_text: string, _record: ExploreSectionResource, index: number) => index + 1,
    },
  ];

  keys.forEach((key) => {
    const column: ColumnProps<any> = {
      key,
      title: getHeaderColumn(key),
      className: 'text-primary-7 cursor-pointer',
      sorter: false,
      ellipsis: true,
      render: LISTING_CONFIG[key as keyof typeof LISTING_CONFIG]?.renderFn,
      onHeaderCell: (cell) => ({
        onClick: () => sorterES(cell),
      }),
    };
    columns.push(column);
  });

  return columns;
};

export default useExploreColumns;
