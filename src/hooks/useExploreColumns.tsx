'use client';

import { Dispatch } from 'react';
import { SetStateAction } from 'jotai';
import { Tooltip } from 'antd';
import { ColumnProps, ColumnType } from 'antd/lib/table';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { format, parseISO, isValid } from 'date-fns';
import { ES_TERMS } from '@/constants/explore-section';
import Link from '@/components/Link';
import { ExploreSectionResource, SortState } from '@/types/explore-section';
import styles from '@/app/explore/explore.module.scss';

const useExploreColumns = (
  keys: string[],
  sortState: SortState,
  setSortState: Dispatch<SetStateAction<SortState>>,
  url: string
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
    const term = ES_TERMS[key as keyof typeof ES_TERMS];

    if (!term) {
      return <div className={styles.tableHeader}>{key}</div>;
    }

    const isSorted = key === sortState.field;

    const iconDirection =
      sortState.order === 'asc' ? (
        <CaretDownOutlined className="flex mr-2" />
      ) : (
        <CaretUpOutlined className="flex mr-2" />
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

  const getRender = (text: string, record: any) =>
    isValid(parseISO(text)) ? (
      format(parseISO(text), 'dd.MM.yyyy')
    ) : (
      <Link href={`/explore/${url}/${record.key}`}>{text}</Link>
    );

  const columns: ColumnProps<ExploreSectionResource>[] = [
    {
      title: getHeaderColumn('#'),
      key: 'index',
      className: 'text-primary-7',
      width: 50,
      render: (_text: string, _record: ExploreSectionResource, index: number) => index + 1,
    },
  ];

  keys.forEach((key) => {
    const column: ColumnProps<ExploreSectionResource> = {
      title: getHeaderColumn(key),
      dataIndex: key,
      key,
      className: 'text-primary-7 cursor-pointer',
      sorter: false,
      ellipsis: true,
      render: getRender,
      onHeaderCell: (cell) => ({
        onClick: () => sorterES(cell),
      }),
    };
    columns.push(column);
  });

  return columns;
};

export default useExploreColumns;
