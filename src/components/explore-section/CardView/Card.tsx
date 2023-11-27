import { useInView } from 'react-intersection-observer';
import { Tooltip } from 'antd';
import { useAtomValue } from 'jotai';
import reject from 'lodash/reject';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';
import { selectedCardsMetricAtom } from '@/state/explore-section/generalization';
import CardVisualization from '@/components/explore-section/CardView/CardVisualization';
import { EXPERIMENT_TYPES } from '@/constants/explore-section/experiment-types';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { ExploreESHit } from '@/types/explore-section/es';

type TooltipFieldProps = {
  label: string;
  content: React.ReactNode;
  cursor: string;
  className?: string;
};

function TooltipField({ label, content, cursor, className }: TooltipFieldProps) {
  return (
    <div className={className}>
      <div className="uppercase text-neutral-4">{label}</div>
      <Tooltip title={content}>
        <div className={`text-primary-8 truncate ${cursor}`}>{content}</div>
      </Tooltip>
    </div>
  );
}

type CardProps = {
  resource: {
    _source: ReconstructedNeuronMorphology | ExperimentalTrace;
  } & ExploreESHit;
  experimentTypeName: string;
  score?: number;
};

export default function Card({ resource, experimentTypeName, score }: CardProps) {
  const { ref, inView } = useInView();

  const selectedCardsMetric = useAtomValue(selectedCardsMetricAtom);

  const cardFields = reject(
    EXPERIMENT_TYPES[experimentTypeName]?.cardViewFields?.[selectedCardsMetric],
    ['field', 'name']
  );

  return (
    <div ref={ref} className="flex flex-col border border-solid rounded-md h-[500px] w-full p-4">
      {score && (
        <div className="text-primary-7 mb-2">
          Score: <span className="font-bold">{score}</span>
        </div>
      )}
      <div className="h-full border rounded-md">
        {inView && (
          <CardVisualization experimentTypeName={experimentTypeName} resource={resource._source} />
        )}
      </div>
      <div>
        <TooltipField cursor="cursor-pointer" label="Name" content={resource._source.name} />
      </div>
      <div className="grid gap-4 grid-cols-6 break-words mt-2">
        {cardFields &&
          cardFields.map((cardField, index) => (
            <div key={cardField.field} className={cardField.className}>
              <TooltipField
                cursor="cursor-help"
                label={EXPLORE_FIELDS_CONFIG[cardField.field].title}
                content={EXPLORE_FIELDS_CONFIG[cardField.field]?.render?.esResourceViewFn?.(
                  'text',
                  resource,
                  index
                )}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
