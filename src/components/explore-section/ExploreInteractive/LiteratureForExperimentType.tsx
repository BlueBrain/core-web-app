'use client';

import { loadable, unwrap } from 'jotai/utils';
import { useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { WarningFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import find from 'lodash/find';
import isNil from 'lodash/isNil';
import { usePathname } from 'next/navigation';

import { ML_MAX_ARTICLES_PER_PAGE } from '../Literature/api';
import StatItem, { StatError, StatItemSkeleton } from './StatItem';
import { getLiteratureCountForBrainRegion } from '@/state/explore-section/interactive';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { brainRegionsAtom, selectedBrainRegionAtom } from '@/state/brain-regions';

export default function LiteratureForExperimentType() {
  const previousFetchController = useRef<AbortController>();
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brainRegions = useAtomValue(useMemo(() => unwrap(brainRegionsAtom), []));
  const brainRegion = find(brainRegions, ['id', selectedBrainRegion?.id]);
  const pathName = usePathname();
  const totalByExperimentAndBrainRegionAtom = useMemo(() => {
    // When the brain regions change, cancel the request for previous brain regions
    if (previousFetchController.current) {
      previousFetchController.current.abort();
    }
    const controller = new AbortController();
    previousFetchController.current = controller;

    return loadable(getLiteratureCountForBrainRegion(brainRegion?.title ?? '', controller.signal));
  }, [brainRegion]);

  const totalByExperimentAndBrainRegion = useAtomValue(totalByExperimentAndBrainRegionAtom);

  return (
    <>
      {totalByExperimentAndBrainRegion.state === 'loading' && (
        <>
          {[...Array.from({ length: 6 }, (_, index) => index)].map((s) => (
            <StatItemSkeleton key={`literature-skeleton${s}`} />
          ))}
        </>
      )}

      {totalByExperimentAndBrainRegion.state === 'hasError' && (
        <StatError text="Error loading literature for brain region." />
      )}

      {totalByExperimentAndBrainRegion.state === 'hasData' && (
        <>
          {Object.entries(EXPERIMENT_DATA_TYPES).map(([id, config]) => {
            const details = totalByExperimentAndBrainRegion.data?.[id];
            const total = details?.total ?? 0;
            const statValue = isNil(details) ? (
              <Tooltip
                title={`There was an error when fetching literature data for ${config.title}.`}
              >
                <WarningFilled />
              </Tooltip>
            ) : (
              `${
                total > ML_MAX_ARTICLES_PER_PAGE ? `${ML_MAX_ARTICLES_PER_PAGE}+` : total
              } articles`
            );

            return (
              <StatItem
                href={`${pathName}/literature/${config.name}`}
                key={config.title}
                testId={`literature-articles-${id}`}
                title={config.title}
                subtitle={statValue}
              />
            );
          })}
        </>
      )}
    </>
  );
}
