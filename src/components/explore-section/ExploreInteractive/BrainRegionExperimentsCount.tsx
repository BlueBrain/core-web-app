'use client';

import { loadable } from 'jotai/utils';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { LoadingOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { BrainRegion } from '@/types/ontologies';
import { getExperimentTotalForBrainRegion } from '@/state/explore-section/interactive';
import { EXPERIMENT_TYPE_DETAILS } from '@/constants/explore-section/experiment-types';

type Props = {
  brainRegions: BrainRegion[];
};

export function BrainRegionExperimentsCount({ brainRegions }: Props) {
  const totalByExperimentAndBrainRegionAtom = useMemo(
    () => loadable(getExperimentTotalForBrainRegion(brainRegions.map((br) => br.id))),
    [brainRegions]
  );
  const totalByExperimentAndBrainRegion = useAtomValue(totalByExperimentAndBrainRegionAtom);
  return (
    <div className="text-white mb-4 h-52 flex-1">
      <h3 className="text-gray-400 py-4 uppercase">Experimental data</h3>

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
              href={`/explore/interactive/data/${experimentType.name}`}
              key={experimentType.title}
              className="border-b-2 border-b-gray-500 flex justify-between py-1 w-2/5 hover:text-primary-4"
              data-testid={`experiment-dataset-${experimentType.id}`}
            >
              <span className="font-light">{experimentType.title}</span>
              <span>
                <span className="font-semibold mr-2">
                  {totalByExperimentAndBrainRegion.data?.[experimentType.id].total}
                </span>
                <MenuOutlined />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
