'use client';

import ExperimentSelector from '@/components/explore-section/Literature/components/ExperimentSelector';
import { ExperimentConfig } from '@/constants/explore-section/experiment-types';
import { filterDataTypes } from '@/util/explore-section/data-types';
import { DataGroups } from '@/types/explore-section/data-groups';

type Props = {
  noExperimentSelected?: boolean;
  noBrainRegionSelected?: boolean;
  currentExperiment?: ExperimentConfig;
};

export default function LiteratureArticlesError({
  noExperimentSelected,
  noBrainRegionSelected,
  currentExperiment,
}: Props) {
  if (noBrainRegionSelected) {
    return (
      <div className="flex mx-10 mt-12 w-full">
        <ExperimentSelector currentExperiment={currentExperiment} />
        <div className="m-auto self-center border p-4">Please select a brain region.</div>
      </div>
    );
  }

  if (noExperimentSelected) {
    const validExperimentTypes = filterDataTypes(DataGroups.Literature).map(
      (experiment) => experiment.name
    );

    return (
      <div className="flex mx-10 mt-12 w-full">
        <ExperimentSelector />
        <div className="m-auto self-center border p-4">
          <h3 className="text-xl text-center">No articles were found for this experiment type.</h3>
          <p>Please make sure that the experiment type is one of the following:</p>
          <br />
          <ul className="m-auto list-disc w-fit self-center">
            {validExperimentTypes.map((experiment) => (
              <li key={experiment}>{experiment}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mx-10 mt-12 w-full">
      <ExperimentSelector currentExperiment={currentExperiment} />

      <div className="m-auto self-center border p-4">
        There was an error fetching literature data for this experiment type.
      </div>
    </div>
  );
}
