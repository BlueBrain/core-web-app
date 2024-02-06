import { useState } from 'react';
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import upperCase from 'lodash/upperCase';
import { ExploreESHit } from '@/types/explore-section/es';
import { DataType } from '@/constants/explore-section/list-views';
import Card from '@/components/explore-section/CardView/Card';
import {
  resourceBasedResponseResultsAtom,
  resourceBasedResponseMorphoMetricsAtom,
} from '@/state/explore-section/generalization';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { useUnwrappedValue } from '@/hooks/hooks';
import { isNeuronMorphologyFeatureAnnotation } from '@/util/explore-section/typeUnionTargetting';
import { getGroupedCardFields } from '@/util/explore-section/cardViewUtils';

const { Panel } = Collapse;

type CardViewProps = {
  data?: ExploreESHit[] | null;
  dataType: DataType;
  resourceId?: string;
};

function ExpandIcon({ isActive }: { isActive?: boolean }) {
  return <CaretRightOutlined rotate={isActive ? 90 : 0} />;
}

export default function CardView({ data, dataType, resourceId = '' }: CardViewProps) {
  const resourceBasedResponseResults = useUnwrappedValue(
    resourceBasedResponseResultsAtom(resourceId)
  );

  const groupedCardFields = getGroupedCardFields(dataType);

  const [activeKeys, setActiveKeys] = useState(Object.keys(groupedCardFields));

  const handleActiveKeysChange = (keys: string | string[]) =>
    setActiveKeys(Array.isArray(keys) ? keys : [keys]);

  const resourceBasedResponseMorphoMetrics = useUnwrappedValue(
    resourceBasedResponseMorphoMetricsAtom({ resourceId, dataType })
  );

  if (!Array.isArray(data)) {
    return data;
  }

  const scoreFinder = (id: string): number | undefined =>
    resourceBasedResponseResults?.find((resource) => resource.id === id)?.score;

  return (
    <div
      className="grid min-h-fit grid-cols-6 gap-0 pb-2"
      data-testid="explore-section-listing-card-view"
    >
      <div className="w-min-[70rem] col-span-1 w-full flex-col break-words pt-[1rem]">
        <div className="pr-4 font-thin text-neutral-4">SCORE</div>
        <div className="mt-1 pr-4 font-thin text-neutral-4">PREVIEW</div>
        <Collapse
          activeKey={activeKeys}
          expandIcon={ExpandIcon}
          onChange={handleActiveKeysChange}
          bordered={false}
          ghost
          className="pt-[23.75rem]"
        >
          {Object.entries(groupedCardFields).map(([group, fields]) => (
            <Panel
              header={
                <span className="text-md font-semibold text-primary-8">{upperCase(group)}</span>
              }
              key={group}
              className="m-0 truncate border-y border-solid p-0"
            >
              {fields.map((item) => (
                <div key={item.field} className="mb-2 ml-7 h-6 truncate font-thin text-neutral-4">
                  {upperCase(EXPLORE_FIELDS_CONFIG[item.field].title)}
                </div>
              ))}
            </Panel>
          ))}
        </Collapse>
      </div>
      <div className="w-max-[350px] col-span-5 flex overflow-x-auto">
        {data.map((d) => (
          <Card
            activeKeys={activeKeys}
            key={d._id}
            resource={{
              ...d,
              _source: d._source as ReconstructedNeuronMorphology | ExperimentalTrace,
            }}
            dataType={dataType}
            metrics={resourceBasedResponseMorphoMetrics?.hits.filter(
              (metric) =>
                isNeuronMorphologyFeatureAnnotation(metric._source) &&
                d._id === metric._source.neuronMorphology
            )}
            score={scoreFinder(d._id)}
          />
        ))}
      </div>
    </div>
  );
}
