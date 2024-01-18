'use client';

import { DATA_TYPES } from '@/constants/explore-section/experiment-types';
import ExperimentTotal from '@/components/explore-section/ExploreInteractive/ExperimentTotal';

export function ExperimentsTotals() {

  return (
    <div className="flex flex-wrap mb-7 h-36 text-white gap-4">
      {Object.keys(DATA_TYPES).map((experimentTypeName) => (
        <ExperimentTotal key={experimentTypeName} experimentTypeName={experimentTypeName} />
      ))}
    </div>
  );
}
