'use client';

import Sidebar from '@/components/explore-section/Sidebar';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import createListViewAtoms from '@/state/explore-section/list-atoms-constructor';
import useExploreColumns from '@/hooks/useExploreColumns';

const TYPE = 'https://neuroshapes.org/NeuronMorphology';

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
  'name',
  'conditions',
  'reference',
  'subjectSpecies',
  'contributors',
  'createdAt',
];

export default function MorphologyPage() {
  const columns = useExploreColumns(columnKeys, sortStateAtom, 'morphology');

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar />
      <ExploreSectionListingView
        title="Neuron morphology"
        totalAtom={totalAtom}
        columns={columns}
        dataAtom={dataAtom}
        pageSizeAtom={pageSizeAtom}
        searchStringAtom={searchStringAtom}
        aggregationsAtom={aggregationsAtom}
        filtersAtom={filtersAtom}
        enableDownload
      />
    </div>
  );
}
