'use client';

import Sidebar from '@/components/explore-section/Sidebar';
import useExploreColumns from '@/hooks/useExploreColumns';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import createListViewAtoms from '@/state/explore-section/list-atoms-constructor';

const TYPE = 'https://neuroshapes.org/NeuronDensity';

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
  'eType',
  'name',
  'conditions',
  'subjectSpecies',
  'contributors',
  'createdAt',
  'reference',
];

export default function NeuronDensity() {
  const columns = useExploreColumns(columnKeys, sortStateAtom, 'neuron-density');

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar />
      <ExploreSectionListingView
        title="Neuron density"
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
