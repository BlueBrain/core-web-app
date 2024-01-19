'use client';

import ExperimentTotal from '@/components/explore-section/ExploreInteractive/ExperimentTotal';
import { DataGroups } from '@/types/explore-section/data-groups';
import { filterDataTypes } from '@/util/explore-section/data-types';

export function ExperimentsTotals() {
  const experimentDataTypes = filterDataTypes([DataGroups.ExperimentData]);
  return (
    <div className="flex flex-wrap mb-7 h-36 text-white gap-4">
      {experimentDataTypes.map((experimentType) => (
        <ExperimentTotal key={experimentType.key} experimentTypeName={experimentType.key} />
      ))}
    </div>
  );
}
