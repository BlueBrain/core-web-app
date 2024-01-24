'use client';

import { useParams } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';
import { useQueryState } from 'nuqs';

import Error from './error';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { ArticleListing as Listing } from '@/components/explore-section/Literature/components/ArticleList/ArticlesListing';
import Filters from '@/components/explore-section/Literature/components/ArticleList/ArticleListFilters';
import {
  articleListFiltersAtom,
  articleListingFilterPanelOpenAtom,
  initialFilters,
} from '@/state/explore-section/literature-filters';

export default function Page() {
  const params = useParams<{ 'experiment-data-type': string }>();
  const openFilterPanel = useSetAtom(articleListingFilterPanelOpenAtom);
  const [filters, updateFilters] = useAtom(articleListFiltersAtom);
  const [brainRegion] = useQueryState('brainRegion');
  const currentExperiment = Object.values(EXPERIMENT_DATA_TYPES).find(
    (experiment) => experiment.name === params?.['experiment-data-type'] ?? ''
  );

  if (!currentExperiment) return <Error noExperimentSelected />;
  if (!brainRegion) return <Error noBrainRegionSelected />;

  return (
    <div className="flex w-full">
      <Listing />
      <Filters
        values={filters}
        onSubmit={updateFilters}
        onClearFilters={() => {
          updateFilters({ ...initialFilters });
          openFilterPanel(false);
        }}
      />
    </div>
  );
}
