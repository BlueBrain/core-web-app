'use client';

import ExperimentLiteratureHeader from '@/components/explore-section/Literature/components/ArticleList/ExperimentLiteratureHeader';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';

type Props = {
  basePath: string;
  noExperimentSelected?: boolean;
  noBrainRegionSelected?: boolean;
};

function ErrorContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-10 mb-2 mt-12 flex h-screen w-full max-w-7xl items-start gap-x-4">
      <div className="mx-10 mt-12 flex w-full flex-col">{children}</div>
    </div>
  );
}

export default function LiteratureArticlesError({
  basePath,
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
        <ExperimentLiteratureHeader basePath={basePath} />
        <div className="m-auto self-center border p-4">
          <h3 className="text-center text-xl">No articles were found for this experiment type.</h3>
          <p>Please make sure that the experiment type is one of the following:</p>
          <br />
          <ul className="m-auto w-fit list-disc self-center">
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
