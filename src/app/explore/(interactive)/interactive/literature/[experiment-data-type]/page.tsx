'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import LiteratureArticlesError from './error';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { ArticleListing } from '@/components/explore-section/Literature/components/ArticlesListing';
import { brainRegionsAtom, visibleBrainRegionsAtom } from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';

export default function LiteratureArticleListingPage() {
  const params = useParams();
  const currentExperiment = Object.values(EXPERIMENT_DATA_TYPES).find(
    (experiment) => experiment.name === params?.['experiment-data-type'] ?? ''
  );
  const visualizedBrainRegions = useAtomValue(visibleBrainRegionsAtom('explore'));
  const brainRegions = useAtomValue(useMemo(() => unwrap(brainRegionsAtom), []));
  const visualizedBrainRegionDetails = visualizedBrainRegions.reduce<BrainRegion[]>(
    (acc, selectedRegion) => {
      const selected = brainRegions?.find((brainRegion) => brainRegion.id === selectedRegion);

      return selected ? [...acc, selected] : acc;
    },
    []
  );

  if (!currentExperiment) return <LiteratureArticlesError noExperimentSelected />;
  if (visualizedBrainRegionDetails.length <= 0)
    return <LiteratureArticlesError noBrainRegionSelected currentExperiment={currentExperiment} />;

  return (
    <div className="flex">
      <ArticleListing
        brainRegions={visualizedBrainRegionDetails.map((br) => br.title)}
        experiment={currentExperiment}
      />
    </div>
  );
}
