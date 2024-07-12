import { ReactNode, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { resourceBasedResponseHitsAtom } from '@/state/explore-section/generalization';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import CardView from '@/components/explore-section/CardView';
import { DataType } from '@/constants/explore-section/list-views';
import { ExploreESHit } from '@/types/explore-section/es';
import {
  ReconstructedNeuronMorphology,
  ExperimentalTrace,
} from '@/types/explore-section/es-experiment';

export const notFound = <h1>No similar resources were found.</h1>;
export const genarilizationError = <h1>Something went wrong while fetching the data</h1>;

export default function WithGeneralization({
  children,
  dataType,
}: {
  children: (props: { render: ReactNode }) => ReactNode;
  dataType: DataType;
}) {
  const { id: resourceId } = useResourceInfoFromPath() ?? { id: '' };

  const resourceBasedResponseHits = useAtomValue(
    useMemo(
      () => loadable(resourceBasedResponseHitsAtom({ resourceId, dataType })),
      [resourceId, dataType]
    )
  );

  let render: ReactNode;

  switch (resourceBasedResponseHits.state) {
    case 'loading':
      break;
    case 'hasError':
      render = genarilizationError;
      break;
    case 'hasData':
      render = resourceBasedResponseHits.data?.length ? (
        <CardView
          data={
            resourceBasedResponseHits.data as ExploreESHit<
              ReconstructedNeuronMorphology | ExperimentalTrace
            >[]
          }
          dataType={dataType}
          resourceId={resourceId}
        />
      ) : (
        notFound
      );
      break;
    default: {
      render = notFound;
    }
  }

  return children({ render });
}
