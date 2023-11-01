'use client';

import { useParams, notFound } from 'next/navigation';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { EXPERIMENT_TYPE_DETAILS } from '@/constants/explore-section/experiment-types';
import { ArticleListing } from '@/components/explore-section/Literature/components/ArticlesListing';
import { visibleExploreBrainRegionsAtom } from '@/state/explore-section/interactive';
import { brainRegionsAtom } from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';

export default function LiteratureArticleListingPage() {
  const params = useParams();
  const currentExperiment = EXPERIMENT_TYPE_DETAILS.find(
    (experiment) => experiment.name === params?.['experiment-data-type'] ?? ''
  );
  const visualizedBrainRegions = useAtomValue(visibleExploreBrainRegionsAtom);
  const brainRegions = useAtomValue(useMemo(() => unwrap(brainRegionsAtom), []));
  const visualizedBrainRegionDetails = visualizedBrainRegions.reduce<BrainRegion[]>(
    (acc, selectedRegion) => {
      const selected = brainRegions?.find((brainRegion) => brainRegion.id === selectedRegion);

      return selected ? [...acc, selected] : acc;
    },
    []
  );

  if (!currentExperiment || visualizedBrainRegionDetails.length <= 0) return notFound();

  return (
    <div className="flex">
      <ArticleListing
        brainRegions={visualizedBrainRegionDetails.map((br) => br.title)}
        experiment={currentExperiment}
      />
    </div>
  );
}
