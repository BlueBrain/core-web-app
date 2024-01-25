import { useState } from 'react';
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import upperCase from 'lodash/upperCase';
import { ExploreESHit } from '@/types/explore-section/es';
import { DataType } from '@/constants/explore-section/list-views';
import Card from '@/components/explore-section/CardView/Card';
import { resourceBasedResponseResultsAtom } from '@/state/explore-section/generalization';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
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

export default function CardView({ data, dataType, resourceId }: CardViewProps) {
  const resourceBasedResponseResults = useAtomValue(
    unwrap(resourceBasedResponseResultsAtom(resourceId || ''))
  );

  const groupedCardFields = getGroupedCardFields(dataType);

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
      <div className="flex-col w-full w-min-[70rem] pt-[1rem] col-span-1 break-words">
        <div className="pr-4 font-thin text-neutral-4">SCORE</div>
        <div className="pr-4 font-thin text-neutral-4 mt-1">PREVIEW</div>
        <Collapse
          activeKey={activeKeys}
          expandIcon={ExpandIcon}
          onChange={handleActiveKeysChange}
          bordered={false}
          ghost
          className="pt-[23.85rem]"
        >
          {Object.entries(groupedCardFields).map(([group, fields]) => (
            <Panel
              header={
                <span className="text-md font-semibold text-primary-8">{upperCase(group)}</span>
              }
              key={group}
              className="p-0 m-0 border-y border-solid"
            >
              {fields.map((item) => (
                <div key={item.field} className="text-neutral-4 mb-2 h-6 ml-7 font-thin truncate">
                  {upperCase(EXPLORE_FIELDS_CONFIG[item.field].title)}
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
            dataType={dataType}
            score={scoreFinder(d._id)}
          />
        ))}
      </div>
    </div>
  );
}
