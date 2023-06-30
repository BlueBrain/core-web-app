'use client';

import { Dispatch, useState, useEffect } from 'react';
import { SetStateAction } from 'jotai';
import { Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CaretDownOutlined, CaretUpOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { SortState } from '@/types/explore-section/application';
import { classNames } from '@/util/utils';
import styles from '@/app/explore/explore.module.scss';

const COL_SIZING = {
  min: 75,
  default: 125,
};
const useExploreColumns = (
  keys: string[],
  sortState: SortState,
  setSortState: Dispatch<SetStateAction<SortState>>
): ColumnProps<ExploreSectionResource>[] => {
  const [resizingState, setResizingState] = useState<{ index: number; start: number } | null>(null);
  const [columns, setColumns] = useState<ColumnProps<ExploreSectionResource>[]>([]);

  const onMouseDown = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setResizingState({
      start: e.clientX,
      index,
    });
  };

  const sorterES = (field: string) => {
    if (field) {
      const toggled = sortState.order === 'asc' ? 'desc' : 'asc';
      const order = sortState.field === field ? toggled : 'asc';
      setSortState({ field, order });
    }
  };

  const getHeaderColumn = (key: string, columnIndex: number) => {
    const term = LISTING_CONFIG[key as keyof typeof LISTING_CONFIG];

    if (!term) {
      return <div className={styles.tableHeader}>{key}</div>;
    }

    const isSorted = key === sortState.field;

    const iconDirection = sortState.order === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />;

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
        <button onClick={() => sorterES(key)} type="button">
          {icon}
        </button>
        <Tooltip
          className={classNames(styles.tableHeaderTitle, 'grow')}
          title={term.description ? term.description : term.title}
        >
          <div>{term.title}</div>
          {term.unit && <div className={styles.tableHeaderUnits}>[{term?.unit}]</div>}
        </Tooltip>
        <VerticalAlignMiddleOutlined
          className={styles.dragIcons}
          onMouseDown={(e) => onMouseDown(e, columnIndex)}
        />
      </div>
    );
  };

  // UseEffect hooks for setting columns properties and events for resizing
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!resizingState) return;

      const delta = e.clientX - resizingState.start;

      setColumns((cols) => {
        const newColumns = [...cols];
        newColumns[resizingState.index] = {
          ...newColumns[resizingState.index],
          width: Math.max(
            COL_SIZING.min,
            (Number(newColumns[resizingState.index].width) || COL_SIZING.default) + delta
          ),
        };
        return newColumns;
      });
      setResizingState({
        start: e.clientX,
        index: resizingState.index,
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [resizingState]);

  useEffect(() => {
    const onMouseUp = () => {
      setResizingState(null);
    };

    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  useEffect(() => {
    const initialColumns: ColumnProps<ExploreSectionResource>[] = [
      {
        title: getHeaderColumn('#', 0),
        key: 'index',
        className: 'text-primary-7',
        width: COL_SIZING.min,
        render: (_text: string, _record: ExploreSectionResource, index: number) => index + 1,
      },
    ];

    keys.forEach((key, columnIndex) => {
      const column: ColumnProps<any> = {
        key,
        title: getHeaderColumn(key, columnIndex + 1),
        className: 'text-primary-7 cursor-pointer',
        sorter: false,
        ellipsis: true,
        width: COL_SIZING.default,
        render: LISTING_CONFIG[key as keyof typeof LISTING_CONFIG]?.renderFn,
      };
      initialColumns.push(column);
    });

    setColumns(initialColumns);
  }, [keys, sortState]);

  return columns;
};

export default useExploreColumns;
