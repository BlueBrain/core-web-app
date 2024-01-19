'use client';

import { loadable } from 'jotai/utils';
import { useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { LoadingOutlined, ReadOutlined, WarningFilled } from '@ant-design/icons';
import Link from 'next/link';

import isNil from 'lodash/isNil';
import { Tooltip } from 'antd';
import { getLiteratureCountForBrainRegion } from '@/state/explore-section/interactive';
import { BrainRegion } from '@/types/ontologies';
import { filterDataTypes } from '@/util/explore-section/data-types';
import { DataGroups } from '@/types/explore-section/data-groups';

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
        brainRegions.map((br) => br.title),
        controller.signal
      )
    );
  }, [brainRegions]);

  const totalByExperimentAndBrainRegion = useAtomValue(totalByExperimentAndBrainRegionAtom);

  return (
    <div>
      {totalByExperimentAndBrainRegion.state === 'loading' && (
        <div className="w-full flex justify-center mt-14">
          <LoadingOutlined />
        </div>
      )}

      {totalByExperimentAndBrainRegion.state === 'hasError' &&
        'Error loading experiment datasets for brain region.'}

      {totalByExperimentAndBrainRegion.state === 'hasData' && (
        <div className="flex flex-wrap mb-7 h-36 text-white gap-4">
          {filterDataTypes(DataGroups.Literature).map((config) => (
            <Link
              href={`/explore/interactive/literature/${config.name}`}
              key={config.title}
              className="border-b-2 border-b-gray-500 flex justify-between py-1 w-2/5 cursor-pointer hover:text-primary-4"
              data-testid={`literature-articles-${config.key}`}
            >
              <span className="font-light">{config.title}</span>
              <span className="flex items-center font-light">
                <span className="mr-2">
                  {isNil(totalByExperimentAndBrainRegion.data?.[config.key]) ? (
                    <Tooltip
                      title={`There was an error when fetching literature data for ${config.title}.`}
                    >
                      <WarningFilled />
                    </Tooltip>
                  ) : (
                    `${totalByExperimentAndBrainRegion.data?.[config.key].total} articles`
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
