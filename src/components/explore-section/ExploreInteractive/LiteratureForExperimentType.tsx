'use client';

import { loadable } from 'jotai/utils';
import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { LoadingOutlined, ReadOutlined } from '@ant-design/icons';
import { BrainRegion } from '@/types/ontologies';
import { getLiteratureCountForBrainRegion } from '@/state/explore-section/interactive';
import { EXPERIMENT_TYPE_DETAILS } from '@/constants/explore-section/experiment-types';

type Props = {
  brainRegion: BrainRegion;
};

export function LiteratureForExperimentType({ brainRegion }: Props) {
  const totalByExperimentAndBrainRegionAtom = useMemo(
    () => loadable(getLiteratureCountForBrainRegion(brainRegion.id)),
    [brainRegion.id]
  );
  const totalByExperimentAndBrainRegion = useAtomValue(totalByExperimentAndBrainRegionAtom);
  const [hoveredExperimentType, setHoveredExperimentType] = useState<string | null>(null);

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
            <div
              key={experimentType.title}
              className="border-b-2 border-b-gray-500 flex justify-between py-1 w-2/5 cursor-pointer"
              style={{
                color:
                  hoveredExperimentType === experimentType.id ? brainRegion.colorCode : 'white',
              }}
              onMouseEnter={() => setHoveredExperimentType(experimentType.id)}
              onMouseLeave={() => setHoveredExperimentType(null)}
              data-testid={`literature-articles-${experimentType.id}`}
            >
              <span className="font-light">{experimentType.title}</span>
              <span className="flex items-center font-light">
                <span className="mr-2">
                  {totalByExperimentAndBrainRegion.data?.[experimentType.id].total} articles
                </span>
                <ReadOutlined />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
