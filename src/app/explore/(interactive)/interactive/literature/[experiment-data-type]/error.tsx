'use client';

import ExperimentLiteratureHeader from '@/components/explore-section/Literature/components/ArticleList/ExperimentLiteratureHeader';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';

type Props = {
  noExperimentSelected?: boolean;
  noBrainRegionSelected?: boolean;
};

function ErrorContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen max-w-7xl w-full flex items-start mx-10 gap-x-4 mt-12 mb-2">
      <div className="flex flex-col mx-10 mt-12 w-full">{children}</div>
    </div>
  );
}

export default function LiteratureArticlesError({
  noExperimentSelected,
  noBrainRegionSelected,
}: Props) {
  if (noBrainRegionSelected) {
    return (
      <ErrorContainer>
        <div className="m-auto self-center border p-4">Please select a brain region.</div>
      </ErrorContainer>
    );
  }

  if (noExperimentSelected) {
    const validExperimentTypes = Object.values(EXPERIMENT_DATA_TYPES).map(
      (experiment) => experiment.name
    );

    return (
      <ErrorContainer>
        <ExperimentLiteratureHeader />
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
      </ErrorContainer>
    );
  }

  return (
    <ErrorContainer>
      <div className="m-auto self-center border p-4">
        There was an error fetching literature data for this experiment type.
      </div>
    </ErrorContainer>
  );
}
