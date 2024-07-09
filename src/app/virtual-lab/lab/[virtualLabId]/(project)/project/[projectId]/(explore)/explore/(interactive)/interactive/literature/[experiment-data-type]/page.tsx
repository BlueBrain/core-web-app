'use client';

import { useParams } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';
import { useQueryState } from 'nuqs';

import Error from './error';
import { ArticleListing as Listing } from '@/components/explore-section/Literature/components/ArticleList/ArticlesListing';
import Filters from '@/components/explore-section/Literature/components/ArticleList/ArticleListFilters';
import {
  articleListFiltersAtom,
  articleListingFilterPanelOpenAtom,
  initialFilters,
} from '@/state/explore-section/literature-filters';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

export default function Page() {
  const params = useParams<{
    virtualLabId: string;
    projectId: string;
    'experiment-data-type': string;
  }>();
  const openFilterPanel = useSetAtom(articleListingFilterPanelOpenAtom);
  const [filters, updateFilters] = useAtom(articleListFiltersAtom);
  const [brainRegion] = useQueryState('brainRegion');
  const currentExperiment = Object.values(EXPERIMENT_DATA_TYPES).find(
    (experiment) => experiment.name === params?.['experiment-data-type'] ?? ''
  );
  const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
  if (!currentExperiment)
    return (
      <Error noExperimentSelected basePath={`${vlProjectUrl}/explore/interactive/literature`} />
    );
  if (!brainRegion)
    return (
      <Error noBrainRegionSelected basePath={`${vlProjectUrl}/explore/interactive/literature`} />
    );

  return (
    <div className="flex w-full">
      <Listing basePath={`${vlProjectUrl}/explore/interactive/literature`} />
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
