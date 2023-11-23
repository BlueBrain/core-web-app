import { useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Select, Spin } from 'antd';
import {
  rulesAtom,
  selectedRulesAtom,
  resourceBasedResponseAggregationsAtom,
  resourceBasedResponseHitsCountAtom,
} from '@/state/explore-section/generalization';
import { filtersAtom } from '@/state/explore-section/list-view-atoms';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import ControlPanel from '@/components/explore-section/ControlPanel';
import FilterControls from '@/components/explore-section/ExploreSectionListingView/FilterControls';
import styles from './styles.module.scss';

const { Option } = Select;

function GeneralizationControls({ experimentTypeName }: { experimentTypeName: string }) {
  const { id: resourceId } = useResourceInfoFromPath() ?? { id: '' };

  const allRules = useAtomValue(useMemo(() => unwrap(rulesAtom(resourceId)), [resourceId]));
  const [selectedRules, setSelectedRules] = useAtom(
    useMemo(() => unwrap(selectedRulesAtom(resourceId)), [resourceId])
  );

  const [showTitles, setShowTitles] = useState(true);

  const [displayControlPanel, setDisplayControlPanel] = useState(false);

  const aggregations = useAtomValue(
    useMemo(
      () => unwrap(resourceBasedResponseAggregationsAtom({ experimentTypeName, resourceId })),
      [resourceId, experimentTypeName]
    )
  );

  const [filters, setFilters] = useAtom(
    useMemo(
      () => unwrap(filtersAtom({ experimentTypeName, resourceId })),
      [experimentTypeName, resourceId]
    )
  );

  const resourceBasedResponseHitsCount = useAtomValue(
    useMemo(
      () => unwrap(resourceBasedResponseHitsCountAtom({ resourceId, experimentTypeName })),
      [resourceId, experimentTypeName]
    )
  );

  if (!allRules || allRules.length < 1) return null;

  return (
    <div>
      <div className="flex items-center">
        <div className={styles.label}>
          Here are the {resourceBasedResponseHitsCount || <Spin />} most similar morphologies
          according to the rules:
        </div>
        <div className="flex-1 ml-2">
          <Select
            mode="multiple"
            className="w-full"
            maxTagCount={1}
            maxTagTextLength={10}
            value={selectedRules}
            onChange={setSelectedRules}
            onDropdownVisibleChange={(visible) => setShowTitles(!visible)}
          >
            {allRules?.map((rule) => (
              <Option key={rule.modelName} value={rule.modelName}>
                <div className="bg-white text-primary-9 px-2 whitespace-normal">
                  {rule.name}
                  {!showTitles && (
                    <p className="pl-5 font-thin text-gray-500">{rule.description}</p>
                  )}
                </div>
              </Option>
            ))}
          </Select>
        </div>
        {filters && (
          <div>
            <FilterControls
              filters={filters}
              displayControlPanel={displayControlPanel}
              setDisplayControlPanel={setDisplayControlPanel}
              experimentTypeName={experimentTypeName}
              resourceId={resourceId}
            />
          </div>
        )}
      </div>
      {displayControlPanel && aggregations && filters && (
        <div className="h-screen fixed right-0 top-0 z-50">
          <ControlPanel
            data-testid="detail-view-control-panel"
            aggregations={aggregations}
            filters={filters}
            setFilters={setFilters}
            toggleDisplay={() => setDisplayControlPanel(false)}
            experimentTypeName={experimentTypeName}
          />
        </div>
      )}
    </div>
  );
}

export default GeneralizationControls;
