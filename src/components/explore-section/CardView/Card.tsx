import { useInView } from 'react-intersection-observer';
import { Tooltip, Collapse } from 'antd';
import Link from 'next/link';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';
import CardVisualization from '@/components/explore-section/CardView/CardVisualization';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { DataType } from '@/constants/explore-section/list-views';
import { ExploreESHit } from '@/types/explore-section/es';
import { detailUrlBuilder } from '@/util/common';
import { getGroupedCardFields } from '@/util/explore-section/cardViewUtils';
import { Field } from '@/constants/explore-section/fields-config/enums';
import styles from './styles.module.scss';

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

  const resourceUrl = detailUrlBuilder(resource, dataType);

  const groupedCardFields = getGroupedCardFields(dataType);

  return (
    <div ref={ref} className="flex-shrink-0 h-fit py-4 px-0 mr-0">
      {score && <div className="text-primary-7 mb-2 font-bold">{score}</div>}
      <div className="min-h-[350px] min-w-[350px] h-full border-x border-t">
        {inView && (
          <Link href={resourceUrl} passHref>
            <CardVisualization dataType={dataType} resource={resource._source} />
          </Link>
        )}
      </div>
      <div className="break-words mt-0">
        <Collapse activeKey={activeKeys} expandIcon={() => null} bordered={false} ghost>
          {Object.entries(groupedCardFields).map(([group, fields]) => (
            <Panel header={group} key={group} className={styles.custom} collapsible="disabled">
              <div className="border-l">
                {fields.map((field, index) => (
                  <div
                    key={field.field}
                    className={`text-primary-8 pl-4 mb-2 h-6  truncate ${field.className}`}
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
                        resource,
                        index
                      )
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
