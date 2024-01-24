import { useInView } from 'react-intersection-observer';
import { Tooltip, Collapse } from 'antd';
import Link from 'next/link';
import groupBy from 'lodash/groupBy';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';
import CardVisualization from '@/components/explore-section/CardView/CardVisualization';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/experiment-types';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { ExploreESHit } from '@/types/explore-section/es';
import { detailUrlBuilder } from '@/util/common';
import { DataType } from '@/constants/explore-section/list-views';
import styles from './styles.module.scss';

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
  dataType: DataType;
  activeKeys: string[];
  score?: number;
};

const { Panel } = Collapse;

export default function Card({ resource, dataType, activeKeys, score }: CardProps) {
  const { ref, inView } = useInView();

  const cardFields = DATA_TYPES_TO_CONFIGS[dataType]?.cardViewFields || [];

  const resourceUrl = detailUrlBuilder(resource, dataType);

  const groupedCardFields = groupBy(
    cardFields,
    (o) => EXPLORE_FIELDS_CONFIG[o.field].group || 'Metadata'
  );

  return (
    <div ref={ref} className="flex-shrink-0 h-fit py-4 px-0 mr-0">
      {score && (
        <div className="text-primary-7 mb-2">
          Score: <span className="font-bold">{score}</span>
        </div>
      )}
      <div className="min-h-[350px] min-w-[350px] h-full border-y border-l">
        {inView && (
          <Link href={resourceUrl} passHref>
            <CardVisualization dataType={dataType} resource={resource._source} />
          </Link>
        )}
      </div>
      <Link href={resourceUrl} passHref>
        <TooltipField
          cursor="cursor-pointer"
          label="Name"
          content={resource._source.name}
          className="pl-3 pt-2"
        />
      </Link>
      <div className="break-words mt-[1.25rem]">
        <Collapse activeKey={activeKeys} expandIcon={() => null} bordered={false} ghost>
          {Object.entries(groupedCardFields).map(([group, fields]) => (
            <Panel header={group} key={group} className={styles.custom} collapsible="disabled">
              <div className="border-l">
                {fields.map((field, index) => (
                  <div
                    key={field.field}
                    className={`text-primary-8 pl-4 mb-2 h-6 ${field.className}`}
                  >
                    {EXPLORE_FIELDS_CONFIG[field.field]?.render?.esResourceViewFn?.(
                      'text',
                      resource,
                      index
                    )}
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
}
