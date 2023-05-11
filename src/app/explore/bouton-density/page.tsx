'use client';

import Sidebar from '@/components/explore-section/Sidebar';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import createListViewAtoms from '@/state/explore-section/list-atoms-constructor';
import useExploreColumns from '@/hooks/useExploreColumns';

const TYPE = 'https://neuroshapes.org/BoutonDensity';

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
});

const columnKeys = [
  'brainRegion',
  'mType',
  'mean ± STD',
  'sem',
  'n° of Cells',
  'subjectSpecies',
  'contributors',
  'createdAt',
  'reference',
];

export default function BoutonDensity() {
  const columns = useExploreColumns(columnKeys, sortStateAtom, 'bouton-density');

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar />
      <ExploreSectionListingView
        title="Bouton density"
        totalAtom={totalAtom}
        columns={columns}
        dataAtom={dataAtom}
        pageSizeAtom={pageSizeAtom}
        searchStringAtom={searchStringAtom}
        aggregationsAtom={aggregationsAtom}
        filtersAtom={filtersAtom}
      />
    </div>
  );
}
