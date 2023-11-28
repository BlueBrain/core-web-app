'use client';

import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnProps } from 'antd/lib/table';
import throttle from 'lodash/throttle';
import { ExploreResource } from '@/types/explore-section/es';
import { SortState } from '@/types/explore-section/application';
import { ValueArray } from '@/components/ListTable';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import styles from '@/app/explore/explore.module.scss';

type ResizeInit = {
  key: string | null;
  start: number | null;
};

const COL_SIZING = {
  min: 75,
  default: 125,
};

export default function useExploreColumns(
  setSortState: Dispatch<SetStateAction<SortState | undefined>>,
  sortState?: SortState,
  initialColumns: ColumnProps<ExploreResource>[] = [],
  dimensionColumns?: string[] | null
): ColumnProps<ExploreResource>[] {
  const keys = useMemo(() => Object.keys(EXPLORE_FIELDS_CONFIG), []);
  const [columnWidths, setColumnWidths] = useState<{ key: string; width: number }[]>(
    [...keys, ...(dimensionColumns || [])].map((key) => ({
      key,
      width: COL_SIZING.default,
    }))
  );

  useEffect(() => {
    const totalKeys = dimensionColumns ? [...keys, ...dimensionColumns] : [...keys];

    setColumnWidths(
      totalKeys.map((key) => ({
        key,
        width: COL_SIZING.default,
      }))
    );
  }, [dimensionColumns, keys]);

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

  const updateColumnWidths = useCallback(
    (resizeInit: ResizeInit, clientX: number) => {
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
    },
    [columnWidths]
  );

  const onMouseDown = useCallback(
    (mouseDownEvent: React.MouseEvent<HTMLElement>, key: string) => {
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
    },
    [updateColumnWidths]
  );

  // Translates ES terminology to AntD terminology.
  const getSortOrder = useCallback(
    (key: string) => {
      switch (sortState?.order) {
        case 'asc':
          return sortState?.field === key ? 'ascend' : null;
        case 'desc':
          return sortState?.field === key ? 'descend' : null;
        default:
          return null;
      }
    },
    [sortState?.field, sortState?.order]
  );

  const main: ColumnProps<ExploreResource>[] = useMemo(
    () =>
      keys.reduce((acc, key) => {
        const term = EXPLORE_FIELDS_CONFIG[key];

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
            sorter: term?.sorter ?? true,
            ellipsis: true,
            width: columnWidths.find(({ key: colKey }) => colKey === key)?.width,
            render: term?.render?.esResourceViewFn,
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
      }, initialColumns),
    [columnWidths, getSortOrder, initialColumns, keys, onMouseDown, sorterES]
  );

  const dimensions: ColumnProps<ExploreResource>[] = useMemo(
    () =>
      (dimensionColumns || []).map((dimColumn) => ({
        key: dimColumn,
        title: (
          <div className="flex flex-col text-left" style={{ marginTop: '-2px' }}>
            <div>{dimColumn}</div>
          </div>
        ),
        className: 'text-primary-7 cursor-pointer',
        sorter: false,
        ellipsis: true,
        width: columnWidths.find(({ key: colKey }) => colKey === dimColumn)?.width,
        render: (_t: any, r: any) =>
          ValueArray({
            value: r._source?.parameter?.coords?.[dimColumn]?.map((label: string) => label),
          }),
        onHeaderCell: () => ({
          handleResizing: (e: React.MouseEvent<HTMLElement>) => onMouseDown(e, dimColumn),
          onClick: () => {},
        }),
        sortOrder: getSortOrder(dimColumn),
      })),
    [columnWidths, dimensionColumns, getSortOrder, onMouseDown]
  );
  return [...main, ...dimensions];
}
