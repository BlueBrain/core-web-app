'use client';

import { Dispatch, useCallback, useEffect, useState } from 'react';
import { SetStateAction } from 'jotai';
import { ColumnProps } from 'antd/lib/table';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { SortState } from '@/types/explore-section/application';

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

  const [resizingState, setResizingState] = useState<{
    key: string | null;
    start: number | null;
  }>({ key: null, start: null });

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

  const onMouseDown = (e: React.MouseEvent<HTMLElement>, key: string) =>
    setResizingState({
      key,
      start: e.clientX,
    });

  const onMouseUp = useCallback(() => {
    setResizingState({
      key: null,
      start: null,
    });
  }, [setResizingState]);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX } = e;
      const { key, start } = resizingState;
      const delta = start ? clientX - start : 0; // No start? No delta.
      const existingColIndex = columnWidths.findIndex(({ key: colKey }) => colKey === key);

      if (existingColIndex !== -1) {
        const updatedWidth = {
          key: key as string,
          width: Math.max(columnWidths[existingColIndex].width + delta, COL_SIZING.min),
        };

        setColumnWidths([
          ...columnWidths.slice(0, existingColIndex),
          updatedWidth,
          ...columnWidths.slice(existingColIndex + 1),
        ]);
      }

      setResizingState({
        key,
        start: clientX,
      });
    },
    [columnWidths, resizingState]
  );

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);

    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);

    return () => window.removeEventListener('mouseup', onMouseUp);
  }, [onMouseUp]);

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
          title: LISTING_CONFIG[key].title,
          className: 'text-primary-7 cursor-pointer',
          sorter: true,
          ellipsis: true,
          width: columnWidths.find(({ key: colKey }) => colKey === key)?.width,
          render: term?.renderFn,
          onHeaderCell: () => ({
            onClick: () => sorterES(key),
            showsortertooltip: {
              title: term.description ? term.description : term.title,
            },
            handleResizing: (e: React.MouseEvent<HTMLElement>) => onMouseDown(e, key),
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
        width: COL_SIZING.min,
        render: (_text: string, _record: ExploreSectionResource, index: number) => index + 1,
      },
    ] as ColumnProps<ExploreSectionResource>[]
  );
};

export default useExploreColumns;
