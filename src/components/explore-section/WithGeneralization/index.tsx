import { ReactNode, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import Error from 'next/error';
import { resourceBasedResponseHitsAtom } from '@/state/explore-section/generalization';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import CardView from '@/components/explore-section/CardView';

export default function WithGeneralization({
  children,
  experimentTypeName,
}: {
  children: (props: { render: ReactNode }) => ReactNode;
  experimentTypeName: string;
}) {
  const { id: resourceId } = useResourceInfoFromPath() ?? { id: '' };

  const resourceBasedResponseHits = useAtomValue(
    useMemo(
      () => loadable(resourceBasedResponseHitsAtom({ resourceId, experimentTypeName })),
      [resourceId, experimentTypeName]
    )
  );

  let render: ReactNode;

  const notFound = <h1>No similar resources were found.</h1>;

  switch (resourceBasedResponseHits.state) {
    case 'loading':
      break;
    case 'hasError':
      render = <Error statusCode={400} title="Something went wrong while fetching the data" />;
      break;
    case 'hasData':
      render = resourceBasedResponseHits.data?.length ? (
        <CardView
          data={resourceBasedResponseHits.data}
          experimentTypeName={experimentTypeName}
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
