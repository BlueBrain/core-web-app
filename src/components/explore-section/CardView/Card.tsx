import {
  Experiment,
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';
import CardVisualization from '@/components/explore-section/CardView/CardVisualization';
import { EXPERIMENT_TYPES } from '@/constants/explore-section/experiment-types';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/explore-fields-config';

type CardProps = {
  resource: Experiment;
  experimentTypeName: string;
  score?: number;
};

export default function Card({ resource, experimentTypeName, score }: CardProps) {
  const cardFields = EXPERIMENT_TYPES[experimentTypeName]?.cardViewFields;

  return (
    <div className="flex flex-col border border-solid rounded-md h-[500px] w-full p-4">
      {score && (
        <div className="text-primary-7 mb-2">
          Score: <span className="font-bold">0.86</span>
        </div>
      )}
      <div className="h-full border rounded-md">
        <CardVisualization
          experimentTypeName={experimentTypeName}
          resource={resource as ReconstructedNeuronMorphology | ExperimentalTrace}
        />
      </div>
      <div>
        <div className="text-neutral-4">NAME</div>
        <div className="text-primary-8">{resource.name}</div>
      </div>
      <div className="grid gap-4 grid-cols-6 break-words mt-2">
        {cardFields &&
          cardFields.map((cardField) => (
            <div key={cardField.field} className={cardField.className}>
              <div className="uppercase text-neutral-4">
                {EXPLORE_FIELDS_CONFIG[cardField.field].title}
              </div>
              <div className="text-primary-8">
                {EXPLORE_FIELDS_CONFIG[cardField.field]?.render?.cardViewFn?.(resource)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
