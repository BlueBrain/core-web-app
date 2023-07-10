'use client';

import { Dispatch, useCallback, useEffect, useState } from 'react';
import { SetStateAction } from 'jotai';
import { ColumnProps } from 'antd/lib/table';
import throttle from 'lodash/throttle';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { SortState } from '@/types/explore-section/application';
import styles from '@/app/explore/explore.module.scss';

type ResizeInit = {
  key: string | null;
  start: number | null;
};

const COL_SIZING = {
  min: 75,
  default: 125,
};

const useExploreColumns = (
  keys: string[],
  setSortState: Dispatch<SetStateAction<SortState | undefined>>,
  sortState?: SortState
): ColumnProps<ExploreSectionResource>[] => {
  const [columnWidths, setColumnWidths] = useState<{ key: string; width: number }[]>([]);

  useEffect(
    () =>
      setColumnWidths(
        keys.map((key) => ({
          key,
          width: COL_SIZING.default,
        }))
      ),
    [keys]
  );

  const sorterES = useCallback(
    (field: string) => {
      let order: 'asc' | 'desc' | null;

      switch (sortState?.order) {
        case 'asc':
          order = field === sortState.field ? 'desc' : 'asc';
          break;
        case 'desc':
          order = field === sortState.field ? null : 'asc';
          break;
        default:
          order = 'asc';
      }

      setSortState({ field, order });
    },
    [setSortState, sortState]
  );

  const updateColumnWidths = (resizeInit: ResizeInit, clientX: number) => {
    const { key, start } = resizeInit;

    const delta = start ? clientX - start : 0; // No start? No delta.
    const colWidthIndex = columnWidths.findIndex(({ key: colKey }) => colKey === key);

    const updatedWidth = {
      key: key as string,
      width: Math.max(columnWidths[colWidthIndex].width + delta, COL_SIZING.min),
    };

    setColumnWidths([
      ...columnWidths.slice(0, colWidthIndex),
      updatedWidth,
      ...columnWidths.slice(colWidthIndex + 1),
    ]);
  };

  const onMouseDown = (mouseDownEvent: React.MouseEvent<HTMLElement>, key: string) => {
    const { clientX } = mouseDownEvent;
    const resizeInit = {
      key,
      start: clientX,
    };

    const handleMouseMove = throttle(
      (moveEvent: MouseEvent) => updateColumnWidths(resizeInit, moveEvent.clientX),
      200
    );

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener(
      'mouseup',
      () => window.removeEventListener('mousemove', handleMouseMove),
      { once: true } // Auto-removeEventListener
    );
  };

  // Translates ES terminology to AntD terminology.
  const getSortOrder = (key: string) => {
    switch (sortState?.order) {
      case 'asc':
        return sortState?.field === key ? 'ascend' : null;
      case 'desc':
        return sortState?.field === key ? 'descend' : null;
      default:
        return null;
    }
  };

  return keys.reduce(
    (acc, key) => {
      const term = LISTING_CONFIG[key as keyof typeof LISTING_CONFIG];

      return [
        ...acc,
        {
          key,
          title: (
            <span className="flex flex-col gap-0.5 text-left" style={{ marginTop: '-2px' }}>
              <span>{term.title}</span>
              {term.unit && <span className={styles.tableHeaderUnits}>[{term?.unit}]</span>}
            </span>
          ),
          className: 'text-primary-7 cursor-pointer',
          sorter: true,
          ellipsis: true,
          width: columnWidths.find(({ key: colKey }) => colKey === key)?.width,
          render: term?.renderFn,
          onHeaderCell: () => ({
            handleResizing: (e: React.MouseEvent<HTMLElement>) => onMouseDown(e, key),
            onClick: () => sorterES(key),
            showsortertooltip: {
              title: term.description ? term.description : term.title,
            },
          }),
          sortOrder: getSortOrder(key),
        },
      ];
    },
    [
      {
        title: '#',
        key: 'index',
        className: 'text-primary-7',
        render: (_text: string, _record: ExploreSectionResource, index: number) => index + 1,
        width: 70,
      },
    ] as ColumnProps<ExploreSectionResource>[]
  );
};

export default useExploreColumns;
