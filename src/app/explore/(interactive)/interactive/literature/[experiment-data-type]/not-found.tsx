'use client';

import { EXPERIMENT_TYPE_DETAILS } from '@/constants/explore-section/experiment-types';

export default function LiteratureArticlesNotFound() {
  const validExperimentTypes = EXPERIMENT_TYPE_DETAILS.map((experiment) => experiment.name);

  return (
    <div className="m-auto self-center border p-4">
      <h3 className="text-xl text-center">No articles were found for this experiment type.</h3>

      <p>
        Please make sure that a brain region is selected and the the experiment type is one of the
        following:
      </p>

      <br />
      <ul className="m-auto list-disc w-fit self-center">
        {validExperimentTypes.map((experiment) => (
          <li key={experiment}>{experiment}</li>
        ))}
      </ul>
    </div>
  );
}
