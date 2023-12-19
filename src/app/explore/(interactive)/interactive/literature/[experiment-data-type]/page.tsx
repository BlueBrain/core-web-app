'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { unwrap } from 'jotai/utils';

import LiteratureArticlesError from './error';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { brainRegionsAtom, dataBrainRegionsAtom } from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';
import { ArticleListing } from '@/components/explore-section/Literature/components/ArticleList/ArticlesListing';
import ArticleListFilters from '@/components/explore-section/Literature/components/ArticleList/ArticleListFilters';
import { ArticleListFilters as Filters } from '@/components/explore-section/Literature/api';
import {
  articleListFilters,
  articleListingFilterPanelOpen,
  initialFilters,
} from '@/state/explore-section/literature-filters';
import { SettingsIcon } from '@/components/icons';

export default function LiteratureArticleListingPage() {
  const params = useParams();
  const currentExperiment = Object.values(EXPERIMENT_DATA_TYPES).find(
    (experiment) => experiment.name === params?.['experiment-data-type'] ?? ''
  );
  const dataBrainRegions = useAtomValue(dataBrainRegionsAtom);
  const brainRegions = useAtomValue(useMemo(() => unwrap(brainRegionsAtom), []));
  const visualizedBrainRegionDetails = Object.keys(dataBrainRegions).reduce<BrainRegion[]>(
    (acc, selectedRegion) => {
      const selected = brainRegions?.find((brainRegion) => brainRegion.id === selectedRegion);

      return selected ? [...acc, selected] : acc;
    },
    []
  );
  const openFilterPanel = useSetAtom(articleListingFilterPanelOpen);
  const [filters, updateFilters] = useAtom(articleListFilters);

  if (!currentExperiment) return <LiteratureArticlesError noExperimentSelected />;
  if (visualizedBrainRegionDetails.length <= 0)
    return <LiteratureArticlesError noBrainRegionSelected currentExperiment={currentExperiment} />;

  return (
    <div className="flex w-full">
      <ArticleListFilters
        values={filters}
        onSubmit={updateFilters}
        onClearFilters={() => {
          updateFilters({ ...initialFilters });
          openFilterPanel(false);
        }}
      />

      <ArticleListing
        brainRegions={visualizedBrainRegionDetails.map((br) => br.title)}
        experiment={currentExperiment}
        filters={filters}
      >
        <div className="flex justify-end m-auto mb-3 max-w-7xl">
          <button
            type="button"
            className="bg-primary-8 flex gap-10 items-center justify-between max-h-[56px] rounded-md p-5 ml-3 mr-5"
            onClick={() => openFilterPanel(true)}
          >
            <div>
              <span className="text-white font-bold mr-2">Filter</span>
              <span className="text-primary-3 text-sm">
                <span data-testid="active-filters-count">
                  {getActiveFiltersCount(filters, initialFilters)}
                </span>{' '}
                Active Filters
              </span>
            </div>
            <SettingsIcon className="rotate-90 text-white" />
          </button>
        </div>
      </ArticleListing>
    </div>
  );
}

const getActiveFiltersCount = (currentFilters: Filters, defaultFilters: Filters) => {
  let activeFilters = 0;

  if (
    currentFilters.publicationDate?.lte !== defaultFilters.publicationDate?.lte ||
    currentFilters.publicationDate?.gte !== defaultFilters.publicationDate?.gte
  ) {
    activeFilters += 1;
  }

  if (currentFilters.authors.length !== defaultFilters.authors.length) {
    activeFilters += 1;
  }

  if (currentFilters.journals.length !== defaultFilters.journals.length) {
    activeFilters += 1;
  }

  if (currentFilters.articleTypes.length !== defaultFilters.articleTypes.length) {
    activeFilters += 1;
  }

  return activeFilters;
};
