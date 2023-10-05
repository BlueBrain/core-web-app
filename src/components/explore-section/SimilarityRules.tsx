import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { resourceBasedResponseAtom } from '@/state/explore-section/generalization';

export default function SimilarityResource({ resourceId }: { resourceId: string }) {
  const resourceBasedResponse = useAtomValue(
    useMemo(() => unwrap(resourceBasedResponseAtom(resourceId)), [resourceId])
  );

  if (!resourceBasedResponse) {
    return <div>No data available</div>;
  }

  return (
    <div className="flex flex-col w-full gap-1 max-w-fit 0 pl-8">
      <h1 className="text-primary-7 text-xl font-thin mx-0">Morphology Source</h1>
    </div>
  );
}
