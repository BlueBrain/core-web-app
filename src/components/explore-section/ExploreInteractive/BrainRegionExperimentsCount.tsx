'use client';

import { loadable } from 'jotai/utils';
import { useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { LoadingOutlined, MenuOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { BrainRegion } from '@/types/ontologies';
import { getExperimentTotalForBrainRegion } from '@/state/explore-section/interactive';
import { EXPERIMENT_TYPE_DETAILS } from '@/constants/explore-section/experiment-types';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

type Props = {
  brainRegion: BrainRegion;
};

export function BrainRegionExperimentsCount({ brainRegion }: Props) {
  const router = useRouter();
  const totalByExperimentAndBrainRegionAtom = useMemo(
    () => loadable(getExperimentTotalForBrainRegion(brainRegion.id)),
    [brainRegion.id]
  );
  const totalByExperimentAndBrainRegion = useAtomValue(totalByExperimentAndBrainRegionAtom);
  const [hoveredExperimentType, setHoveredExperimentType] = useState<string | null>(null);
  const setSelectedBrainRegion = useSetAtom(selectedBrainRegionAtom);
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
            <a
              href={experimentType.route}
              key={experimentType.title}
              className="border-b-2 border-b-gray-500 flex justify-between py-1 w-2/5"
              style={{
                color:
                  hoveredExperimentType === experimentType.id ? brainRegion.colorCode : 'white',
              }}
              onClick={(e) => {
                e.preventDefault();
                setSelectedBrainRegion({
                  id: brainRegion.id,
                  title: brainRegion.title,
                  leaves: brainRegion.leaves || null,
                  representedInAnnotation: brainRegion.representedInAnnotation,
                });
                router.push(experimentType.route);
              }}
              onMouseEnter={() => setHoveredExperimentType(experimentType.id)}
              onMouseLeave={() => setHoveredExperimentType(null)}
              data-testid={`experiment-dataset-${experimentType.id}`}
            >
              <span className="font-light">{experimentType.title}</span>
              <span>
                <span className="font-semibold mr-2">
                  {totalByExperimentAndBrainRegion.data?.[experimentType.id].total}
                </span>
                <MenuOutlined />
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
