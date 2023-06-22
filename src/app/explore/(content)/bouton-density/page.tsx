'use client';

import { useMemo } from 'react';
import { loadable } from 'jotai/utils';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import createListViewAtoms from '@/state/explore-section/list-atoms-constructor';
import useExploreColumns from '@/hooks/useExploreColumns';
import { useListViewAtoms, useSetListViewAtoms } from '@/hooks/useListViewAtoms';

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
  pageSizeAtom,
  searchStringAtom,
  filtersAtom,
  dataAtom,
  totalAtom,
  aggregationsAtom,
  sortStateAtom,
} = createListViewAtoms({
  type: TYPE,
  columns: columnKeys,
});

export default function BoutonDensityPage() {
  const atomValues = useListViewAtoms({
    aggregations: useMemo(() => loadable(aggregationsAtom), []),
    data: useMemo(() => loadable(dataAtom), []),
    filters: filtersAtom,
    pageSize: pageSizeAtom,
    searchString: searchStringAtom,
    sortState: sortStateAtom,
    total: useMemo(() => loadable(totalAtom), []),
  });

  const atomSetters = useSetListViewAtoms({
    setFilters: filtersAtom,
    setSearchString: searchStringAtom,
    setSortState: sortStateAtom,
    setPageSize: pageSizeAtom,
  });

  const { setFilters, setSearchString, setSortState, setPageSize } = atomSetters;

  const columns = useExploreColumns(columnKeys, atomValues.sortState, setSortState);

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <ExploreSectionListingView
        atomValues={atomValues}
        columns={columns}
        onLoadMore={() => {
          setPageSize(atomValues.pageSize + 30);
        }}
        setFilters={setFilters}
        setSearchString={setSearchString}
        title="Bouton density"
      />
    </div>
  );
}
