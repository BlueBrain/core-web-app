'use client';

import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnProps } from 'antd/lib/table';
import throttle from 'lodash/throttle';
import { ExploreResource } from '@/types/explore-section/es';
import { SortState } from '@/types/explore-section/application';
import { ValueArray } from '@/components/ListTable';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { ExperimentDataTypeName } from '@/constants/explore-section/list-views';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { classNames } from '@/util/utils';

import styles from '@/app/explore/explore.module.scss';

type ResizeInit = {
  key: string | null;
  start: number | null;
};

const COL_SIZING = {
  min: 75,
  default: 125,
};

/**
 * This fn will get the exact width that the column title must take in the table
 * the returned width will be the Max between the default width and the
 * the width of the sum of the title, the sorting arrows and the unit (if present)
 * @param title string
 * @param unit string
 * @returns number
 */
function getProvisionedWidth(title: string, unit?: string) {
  const titleSpan = document.createElement('span');
  titleSpan.textContent = `${title} ${unit ?? ''}`;
  // font-{size/weight} must be the same as the column style
  titleSpan.style.setProperty('font-size', '1rem');
  document.body.appendChild(titleSpan);
  // 56= x-padding (32px) + (sorter icon) 24
  const width = titleSpan.getBoundingClientRect().width + 56;
  document.body.removeChild(titleSpan);
  return Math.max(width, COL_SIZING.default);
}

export default function useExploreColumns(
  setSortState: Dispatch<SetStateAction<SortState | undefined>>,
  sortState?: SortState,
  initialColumns: ColumnProps<ExploreResource>[] = [],
  dimensionColumns?: string[] | null,
  experimentTypeName?: ExperimentDataTypeName
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
        width:
          EXPLORE_FIELDS_CONFIG[key]?.style?.width ??
          getProvisionedWidth(EXPLORE_FIELDS_CONFIG[key]?.title, EXPLORE_FIELDS_CONFIG[key]?.unit),
      }))
    );
  }, [dimensionColumns, keys]);

  const sorterES = useCallback(
    (field: string) => {
      let order: 'asc' | 'desc' = 'asc';

      if (sortState?.order && field === sortState.field) {
        order = sortState.order === 'desc' ? 'asc' : 'desc';
      }

      setSortState({
        field,
        order,
      });
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
            className: classNames('text-primary-7 cursor-pointer', term?.className),
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
            align: term.style?.align,
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

  const columns = [...main, ...dimensions];

  if (experimentTypeName) {
    return columns.sort((a, b) =>
      a.key && b.key
        ? EXPERIMENT_DATA_TYPES[experimentTypeName].columns.indexOf(a.key as string) -
          EXPERIMENT_DATA_TYPES[experimentTypeName].columns.indexOf(b.key as string)
        : -1
    );
  }

  return columns;
}
