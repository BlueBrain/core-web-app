import { useInView } from 'react-intersection-observer';
import { Tooltip, Collapse } from 'antd';
import Link from 'next/link';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
  MorphoMetricCompartment,
} from '@/types/explore-section/es-experiment';
import CardVisualization from '@/components/explore-section/CardView/CardVisualization';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { DataType } from '@/constants/explore-section/list-views';
import { ExploreESHit } from '@/types/explore-section/es';
import { detailUrlBuilder } from '@/util/common';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { BASE_EXPERIMENTAL_EXPLORE_PATH } from '@/constants/explore-section/paths';
import { useMorphometrics } from '@/hooks/useMorphoMetrics';
import styles from './styles.module.scss';

type CardDataType = ReconstructedNeuronMorphology | ExperimentalTrace;

type CardProps = {
  resource: {
    _source: CardDataType;
  } & ExploreESHit<CardDataType>;
  dataType: DataType;
  activeKeys: string[];
  metrics?: ExploreESHit<CardDataType>[];
  score?: number;
};

const { Panel } = Collapse;

export default function Card({ resource, dataType, activeKeys, metrics, score }: CardProps) {
  const { ref, inView } = useInView();

  const resourceUrl = detailUrlBuilder(BASE_EXPERIMENTAL_EXPLORE_PATH, resource);

  const { groupedCardFields, renderMetric } = useMorphometrics(dataType, metrics);

  return (
    <div ref={ref} className="mr-0 h-fit flex-shrink-0 px-0 py-4">
      {score && <div className="mb-2 font-bold text-primary-7">{score}</div>}
      <div className="h-full min-h-[350px] min-w-[350px] border-x border-t">
        {inView && (
          <Link href={resourceUrl} passHref>
            <CardVisualization dataType={dataType} resource={resource._source} />
          </Link>
        )}
      </div>
      <div className="mt-0 break-words">
        <Collapse activeKey={activeKeys} expandIcon={() => null} bordered={false} ghost>
          {Object.entries(groupedCardFields).map(([group, fields]) => (
            <Panel header={group} key={group} className={styles.custom} collapsible="disabled">
              <div className="border-l">
                {fields.map((field) => {
                  switch (group) {
                    case 'Metadata':
                      return (
                        <div
                          key={field.field}
                          className={`mb-2 h-6 truncate pl-4 text-primary-8 ${field.className}`}
                        >
                          {field.field === Field.Name ? (
                            <Link href={resourceUrl} passHref>
                              <Tooltip title={resource._source.name} className="cursor-pointer">
                                <div className="text-primary-8">{resource._source.name}</div>
                              </Tooltip>
                            </Link>
                          ) : (
                            EXPLORE_FIELDS_CONFIG[field.field]?.render?.esResourceViewFn?.(
                              'text',
                              resource
                            )
                          )}
                        </div>
                      );
                    case MorphoMetricCompartment.NeuronMorphology:
                      return renderMetric(MorphoMetricCompartment.NeuronMorphology, field);
                    case MorphoMetricCompartment.ApicalDendrite:
                      return renderMetric(MorphoMetricCompartment.ApicalDendrite, field);
                    case MorphoMetricCompartment.BasalDendrite:
                      return renderMetric(MorphoMetricCompartment.BasalDendrite, field);
                    case MorphoMetricCompartment.Axon:
                      return renderMetric(MorphoMetricCompartment.Axon, field);
                    case MorphoMetricCompartment.Soma:
                      return renderMetric(MorphoMetricCompartment.Soma, field);
                    default:
                      return null;
                  }
                })}
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
}
