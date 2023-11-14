import { ExploreESHit } from '@/types/explore-section/es';
import Card from '@/components/explore-section/CardView/Card';
import { ReconstructedNeuronMorphology } from '@/types/explore-section/es-experiment';

type CardViewProps = {
  data?: ExploreESHit[] | null;
  experimentTypeName: string;
};

export default function CardView({ data, experimentTypeName }: CardViewProps) {
  if (!Array.isArray(data)) {
    return data;
  }

  return (
    <div className="grid grid-cols-3 gap-4" data-testid="explore-section-listing-card-view">
      {data.map((d) => (
        <Card
          key={d._id}
          resource={d._source as ReconstructedNeuronMorphology}
          experimentTypeName={experimentTypeName}
        />
      ))}
    </div>
  );
}
