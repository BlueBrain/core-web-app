'use client';

import { loadable } from 'jotai/utils';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { LoadingOutlined, ReadOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { BrainRegion } from '@/types/ontologies';
import { getLiteratureCountForBrainRegion } from '@/state/explore-section/interactive';
import { EXPERIMENT_TYPE_DETAILS } from '@/constants/explore-section/experiment-types';

type Props = {
  brainRegions: BrainRegion[];
};

export function LiteratureForExperimentType({ brainRegions }: Props) {
  const totalByExperimentAndBrainRegionAtom = useMemo(
    () => loadable(getLiteratureCountForBrainRegion(brainRegions.map((br) => br.id))),
    [brainRegions]
  );
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
          {EXPERIMENT_TYPE_DETAILS.map((experimentType) => (
            <Link
              href={`/explore/interactive/literature/${experimentType.name}`}
              key={experimentType.title}
              className="border-b-2 border-b-gray-500 flex justify-between py-1 w-2/5 cursor-pointer hover:text-primary-4"
              data-testid={`literature-articles-${experimentType.id}`}
            >
              <span className="font-light">{experimentType.title}</span>
              <span className="flex items-center font-light">
                <span className="mr-2">
                  {totalByExperimentAndBrainRegion.data?.[experimentType.id].total} articles
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
