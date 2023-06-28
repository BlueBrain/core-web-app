'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { loadable } from 'jotai/utils';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import createListViewAtoms from '@/state/explore-section/list-atoms-constructor';
import useExploreColumns from '@/hooks/useExploreColumns';
import { useListViewAtoms } from '@/hooks/useListViewAtoms';

const TYPE = 'https://neuroshapes.org/BoutonDensity';

const columnKeys = [
  'brainRegion',
  'mType',
  'meanstd',
  'sem',
  'numberOfCells',
  'subjectSpecies',
  'contributors',
  'createdAt',
  'reference',
];

const {
  activeColumnsAtom,
  aggregationsAtom,
  dataAtom,
  filtersAtom,
  pageSizeAtom,
  searchStringAtom,
  sortStateAtom,
  totalAtom,
} = createListViewAtoms({
  type: TYPE,
  columns: columnKeys,
});

export default function EphyListPage() {
  const atoms = useListViewAtoms({
    activeColumns: activeColumnsAtom,
    aggregations: useMemo(() => loadable(aggregationsAtom), []),
    data: useMemo(() => loadable(dataAtom), []),
    filters: filtersAtom,
    pageSize: pageSizeAtom,
    searchString: searchStringAtom,
    sortState: sortStateAtom,
    total: useMemo(() => loadable(totalAtom), []),
  });

  const {
    activeColumns: [activeColumns, setActiveColumns],
    aggregations: [aggregations],
    data: [data],
    filters: [filters, setFilters],
    searchString: [searchString, setSearchString],
    sortState: [sortState, setSortState],
    pageSize: [pageSize, setPageSize],
    total: [total],
  } = atoms;

  const columns = useExploreColumns(columnKeys, sortState, setSortState);

  // Display all columns by default.
  useEffect(() => setActiveColumns(['index', ...columnKeys]), [setActiveColumns]);

  const onToggleActive = useCallback(
    (key: string) => {
      const existingIndex = activeColumns.findIndex((existingKey) => existingKey === key);

      return existingIndex === -1
        ? setActiveColumns([...activeColumns, key])
        : setActiveColumns([
            ...activeColumns.slice(0, existingIndex),
            ...activeColumns.slice(existingIndex + 1),
          ]);
    },
    [activeColumns, setActiveColumns]
  );

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <ExploreSectionListingView
        activeColumns={activeColumns}
        aggregations={aggregations}
        columns={columns.filter(({ key }) => activeColumns.includes(key as string))}
        data={data}
        enableDownload
        filters={filters}
        onLoadMore={() => {
          setPageSize(pageSize + 30);
        }}
        onToggleActive={onToggleActive}
        searchString={searchString}
        setFilters={setFilters}
        setSearchString={setSearchString}
        title="Bouton density"
        total={total}
      />
    </div>
  );
}
