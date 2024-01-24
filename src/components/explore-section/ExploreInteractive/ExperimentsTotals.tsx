'use client';

import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';
import ExperimentTotal from '@/components/explore-section/ExploreInteractive/ExperimentTotal';
import { DataType } from '@/constants/explore-section/list-views';

export function ExperimentsTotals() {
  return (
    <div className="flex flex-wrap mb-7 h-36 text-white gap-4">
      {Object.keys(EXPERIMENT_DATA_TYPES).map((dataType) => (
        <ExperimentTotal key={dataType} dataType={dataType as DataType} />
      ))}
    </div>
  );
}
