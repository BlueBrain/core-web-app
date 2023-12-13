'use client';

import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';
import ExperimentTotal from '@/components/explore-section/ExploreInteractive/ExperimentTotal';

export function ExperimentsTotals() {
  return (
    <div className="text-white mb-4 h-52 flex-1">
      <h3 className="text-gray-400 py-4 uppercase">Experimental data</h3>
      <div className="flex flex-col flex-wrap mb-7 h-36">
        {Object.keys(EXPERIMENT_DATA_TYPES).map((experimentTypeName) => (
          <ExperimentTotal key={experimentTypeName} experimentTypeName={experimentTypeName} />
        ))}
      </div>
    </div>
  );
}
