'use client';

import { useParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { useQueryState } from 'nuqs';

import Error from './error';
import { ArticleListing as Listing } from '@/components/explore-section/Literature/components/ArticleList/ArticlesListing';
import Filters from '@/components/explore-section/Literature/components/ArticleList/ArticleListFilters';
import { articleListFiltersAtom, initialFilters } from '@/state/explore-section/literature-filters';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';

export default function Page() {
  const params = useParams<{ 'experiment-data-type': string }>();
  const [filters, updateFilters] = useAtom(articleListFiltersAtom);
  const [brainRegion] = useQueryState('brainRegion');
  const currentExperiment = Object.values(EXPERIMENT_DATA_TYPES).find(
    (experiment) => experiment.name === params?.['experiment-data-type'] ?? ''
  );

  if (!currentExperiment)
    return <Error noExperimentSelected basePath="/explore/interactive/literature" />;
  if (!brainRegion)
    return <Error noBrainRegionSelected basePath="/explore/interactive/literature" />;

  return (
    <div className="flex w-full">
      <Listing basePath="/explore/interactive/literature" />
      <Filters
        values={filters}
        onSubmit={updateFilters}
        onClearFilters={() => {
          updateFilters({ ...initialFilters });
        }}
      />
    </div>
  );
}
