import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { ExploreESHit } from '@/types/explore-section/es';
import Card from '@/components/explore-section/CardView/Card';
import { ReconstructedNeuronMorphology } from '@/types/explore-section/es-experiment';
import { resourceBasedResponseResultsAtom } from '@/state/explore-section/generalization';

type CardViewProps = {
  data?: ExploreESHit[] | null;
  experimentTypeName: string;
  resourceId?: string;
};

export default function CardView({ data, experimentTypeName, resourceId }: CardViewProps) {
  const resourceBasedResponseResults = useAtomValue(
    unwrap(resourceBasedResponseResultsAtom(resourceId || ''))
  );

  if (!Array.isArray(data)) {
    return data;
  }

  const scoreFinder = (id: string): number | undefined =>
    resourceBasedResponseResults?.find((resource) => resource.id === id)?.score;

  return (
    <div className="grid grid-cols-3 gap-4" data-testid="explore-section-listing-card-view">
      {data.map((d) => (
        <Card
          key={d._id}
          resource={d._source as ReconstructedNeuronMorphology}
          experimentTypeName={experimentTypeName}
          score={scoreFinder(d._id)}
        />
      ))}
    </div>
  );
}
