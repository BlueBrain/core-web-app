import { ReactNode, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import Error from 'next/error';
import { resourceBasedResponseDataAtom } from '@/state/explore-section/generalization';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
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

  const resourceBasedResponseData = useAtomValue(
    useMemo(() => loadable(resourceBasedResponseDataAtom(resourceId)), [resourceId])
  );

  let render: ReactNode;

  const notFound = <h1>Inferred resources not found.</h1>;

  switch (resourceBasedResponseData.state) {
    case 'loading':
      render = <CentralLoadingSpinner />;
      break;
    case 'hasError':
      render = <Error statusCode={400} title="Something went wrong while fetching the data" />;
      break;
    case 'hasData':
      render = resourceBasedResponseData.data?.length ? (
        <CardView data={resourceBasedResponseData.data} experimentTypeName={experimentTypeName} />
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
