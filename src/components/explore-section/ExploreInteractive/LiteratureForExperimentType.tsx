'use client';

import { loadable } from 'jotai/utils';
import { useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { LoadingOutlined, ReadOutlined, WarningFilled } from '@ant-design/icons';
import Link from 'next/link';

import isNil from 'lodash/isNil';
import { Tooltip } from 'antd';
import { getLiteratureCountForBrainRegion } from '@/state/explore-section/interactive';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { BrainRegion } from '@/types/ontologies';

type Props = {
  brainRegions: BrainRegion[];
};

export function LiteratureForExperimentType({ brainRegions }: Props) {
  const previousFetchController = useRef<AbortController>();

  const totalByExperimentAndBrainRegionAtom = useMemo(() => {
    // When the brain regions change, cancel the request for previous brain regions
    if (previousFetchController.current) {
      previousFetchController.current.abort();
    }
    const controller = new AbortController();
    previousFetchController.current = controller;

    return loadable(
      getLiteratureCountForBrainRegion(
        brainRegions.map((br) => br.label),
        controller.signal
      )
    );
  }, [brainRegions]);

  const totalByExperimentAndBrainRegion = useAtomValue(totalByExperimentAndBrainRegionAtom);

  return (
    <div className="text-white mb-4 h-52 flex-1">
      <h3 className="text-gray-400 py-4 uppercase">Literature</h3>

      {totalByExperimentAndBrainRegion.state === 'loading' && (
        <div className="w-full flex justify-center mt-14">
          <LoadingOutlined />
        </div>
      )}

      {totalByExperimentAndBrainRegion.state === 'hasError' &&
        'Error loading experiment datasets for brain region.'}

      {totalByExperimentAndBrainRegion.state === 'hasData' && (
        <div className="flex flex-col flex-wrap mb-7 h-36">
          {Object.entries(EXPERIMENT_DATA_TYPES).map(([id, config]) => (
            <Link
              href={`/explore/interactive/literature/${config.name}`}
              key={config.title}
              className="border-b-2 border-b-gray-500 flex justify-between py-1 w-2/5 cursor-pointer hover:text-primary-4"
              data-testid={`literature-articles-${id}`}
            >
              <span className="font-light">{config.title}</span>
              <span className="flex items-center font-light">
                <span className="mr-2">
                  {isNil(totalByExperimentAndBrainRegion.data?.[id]) ? (
                    <Tooltip
                      title={`There was an error when fetching literature data for ${config.title}.`}
                    >
                      <WarningFilled />
                    </Tooltip>
                  ) : (
                    `${totalByExperimentAndBrainRegion.data?.[id].total} articles`
                  )}
                </span>
                <ReadOutlined />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
