'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { ColumnProps } from 'antd/lib/table';
import throttle from 'lodash/throttle';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { columnKeysAtom, sortStateAtom } from '@/state/explore-section/list-view-atoms';
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
  initialColumns?: ColumnProps<ExploreSectionResource>[]
): ColumnProps<ExploreSectionResource>[] => {
  const [columnWidths, setColumnWidths] = useState<{ key: string; width: number }[]>([]);

  const keys = useAtomValue(columnKeysAtom);
  const [sortState, setSortState] = useAtom(sortStateAtom);

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

  return keys.reduce((acc, key) => {
    const term = LISTING_CONFIG[key];

    return [
      ...acc,
      {
        key,
        title: (
          <div className="flex flex-col text-left" style={{ marginTop: '-2px' }}>
            <div>{term.title}</div>
            {term.unit && <div className={styles.tableHeaderUnits}>[{term?.unit}]</div>}
          </div>
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
  }, initialColumns ?? []);
};

export default useExploreColumns;
