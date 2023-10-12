'use client';

import { loadable } from 'jotai/utils';
import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { LoadingOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { BrainRegion } from '@/types/ontologies';
import { getExperimentTotalForBrainRegion } from '@/state/explore-section/interactive';
import { EXPERIMENT_TYPE_DETAILS } from '@/constants/explore-section/experiment-types';

type Props = {
  brainRegion: BrainRegion;
};

export function BrainRegionExperimentsCount({ brainRegion }: Props) {
  const totalByExperimentAndBrainRegionAtom = useMemo(
    () => loadable(getExperimentTotalForBrainRegion(brainRegion.id)),
    [brainRegion.id]
  );
  const totalByExperimentAndBrainRegion = useAtomValue(totalByExperimentAndBrainRegionAtom);
  const [hoveredExperimentType, setHoveredExperimentType] = useState<string | null>(null);

  return (
    <div className="text-white mb-4 h-52">
      <h3 className="text-gray-400 py-4 uppercase">Experimental data</h3>

      {totalByExperimentAndBrainRegion.state === 'loading' && (
        <div className="w-full flex justify-center mt-14">
          <LoadingOutlined />
        </div>
      )}
      {totalByExperimentAndBrainRegion.state === 'hasError' &&
        'Error loading experiment datasets for brain region.'}

      {totalByExperimentAndBrainRegion.state === 'hasData' && (
        <div className="flex flex-col flex-wrap mb-7 h-36 w-fit">
          {EXPERIMENT_TYPE_DETAILS.map((experimentType) => (
            <Link
              href={experimentType.route}
              key={experimentType.title}
              className="w-60 border-b-2 border-b-gray-500 flex justify-between py-1 mr-7"
              style={{
                color:
                  hoveredExperimentType === experimentType.id ? brainRegion.colorCode : 'white',
              }}
              onMouseEnter={() => setHoveredExperimentType(experimentType.id)}
              onMouseLeave={() => setHoveredExperimentType(null)}
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
