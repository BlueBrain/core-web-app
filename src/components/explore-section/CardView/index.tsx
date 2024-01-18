import { useState } from 'react';
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import reject from 'lodash/reject';
import groupBy from 'lodash/groupBy';
import { ExploreESHit } from '@/types/explore-section/es';
import Card from '@/components/explore-section/CardView/Card';
import { resourceBasedResponseResultsAtom } from '@/state/explore-section/generalization';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { DATA_TYPES } from '@/constants/explore-section/experiment-types';

const { Panel } = Collapse;

type CardViewProps = {
  data?: ExploreESHit[] | null;
  experimentTypeName: string;
  resourceId?: string;
};

function ExpandIcon({ isActive }: { isActive?: boolean }) {
  return <CaretRightOutlined rotate={isActive ? 90 : 0} />;
}

export default function CardView({ data, experimentTypeName, resourceId }: CardViewProps) {
  const resourceBasedResponseResults = useAtomValue(
    unwrap(resourceBasedResponseResultsAtom(resourceId || ''))
  );

  const cardFields =
    reject(DATA_TYPES[experimentTypeName]?.cardViewFields, (o) => o.field === 'field') || [];

  const filteredLabels = cardFields.map((fieldObj) => fieldObj.field);

  const groupedCardFields = groupBy(
    filteredLabels,
    (field) => EXPLORE_FIELDS_CONFIG[field].group || 'Metadata'
  );

  const [activeKeys, setActiveKeys] = useState(Object.keys(groupedCardFields));

  const handleActiveKeysChange = (keys: string | string[]) =>
    setActiveKeys(Array.isArray(keys) ? keys : [keys]);

  if (!Array.isArray(data)) {
    return data;
  }

  const scoreFinder = (id: string): number | undefined =>
    resourceBasedResponseResults?.find((resource) => resource.id === id)?.score;

  return (
    <div
      className="grid grid-cols-6 gap-0 pb-2 min-h-fit"
      data-testid="explore-section-listing-card-view"
    >
      <div className="flex-col pt-[460px] w-full w-min-[450px] col-span-1 break-words">
        <Collapse
          activeKey={activeKeys}
          expandIcon={ExpandIcon}
          onChange={handleActiveKeysChange}
          bordered={false}
          ghost
        >
          {Object.entries(groupedCardFields).map(([group, fields]) => (
            <Panel header={group} key={group} className="p-0 m-0 border-t border-solid">
              {fields.map((field) => (
                <div key={field} className="text-neutral-5 mb-2 h-6 pl-4 ml-4">
                  {EXPLORE_FIELDS_CONFIG[field].title}
                </div>
              ))}
            </Panel>
          ))}
        </Collapse>
      </div>
      <div className="col-span-5 flex overflow-x-auto">
        {data.map((d) => (
          <Card
            activeKeys={activeKeys}
            key={d._id}
            resource={{
              ...d,
              _source: d._source as ReconstructedNeuronMorphology | ExperimentalTrace,
            }}
            experimentTypeName={experimentTypeName}
            score={scoreFinder(d._id)}
          />
        ))}
      </div>
    </div>
  );
}
