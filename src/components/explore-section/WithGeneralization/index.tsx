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
import CentralLoadingWheel from '@/components/CentralLoadingWheel';

const spinStyles = {
  display: 'table',
  width: '100%',
  height: '200px',
  paddingTop: 'calc(15vh - 27px)',
};
const loadingIconText = 'Searching for similar morphologies';
const notFoundText = 'No similar morphologies were found';

export const genarilizationError = <h1>Something went wrong while fetching the data</h1>;
export const notFound = <CentralLoadingWheel style={spinStyles} text={notFoundText} noResults />;

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
      render = <CentralLoadingWheel style={spinStyles} text={loadingIconText} />;
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
        (render = notFound)
      );
      break;
    default: {
      render = notFound;
    }
  }

  return children({ render });
}
