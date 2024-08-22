import { useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Spin, ConfigProvider, ThemeConfig } from 'antd';
import RulesControls from './RulesControls';
import {
  rulesAtom,
  resourceBasedResponseAggregationsAtom,
  resourceBasedResponseHitsCountAtom,
} from '@/state/explore-section/generalization';
import { filtersAtom } from '@/state/explore-section/list-view-atoms';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import ControlPanel from '@/components/explore-section/ControlPanel';
import FilterControls from '@/components/explore-section/ExploreSectionListingView/FilterControls';
import { DataType } from '@/constants/explore-section/list-views';
import styles from './styles.module.scss';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#002766',
    colorPrimaryBorder: '#002766',
    colorPrimaryHover: '#002766',
  },
};

function GeneralizationControls({ dataType }: { dataType: DataType }) {
  const { id: resourceId } = useResourceInfoFromPath() ?? { id: '' };

  const allRules = useAtomValue(useMemo(() => unwrap(rulesAtom(resourceId)), [resourceId]));

  const [displayControlPanel, setDisplayControlPanel] = useState(false);

  const [filters, setFilters] = useAtom(
    useMemo(() => unwrap(filtersAtom({ dataType, resourceId })), [dataType, resourceId])
  );

  const aggregations = useAtomValue(
    useMemo(
      () => unwrap(resourceBasedResponseAggregationsAtom({ resourceId, dataType })),
      [dataType, resourceId]
    )
  );

  const resourceBasedResponseHitsCount = useAtomValue(
    useMemo(
      () => unwrap(resourceBasedResponseHitsCountAtom({ resourceId, dataType })),
      [dataType, resourceId]
    )
  );

  if (!allRules || allRules.length < 1) return null;

  return (
    <ConfigProvider theme={theme}>
      <div className="mt-14 flex items-center">
        <div className={styles.label}>
          Here are the {resourceBasedResponseHitsCount || <Spin />} most similar morphologies based
          on:
        </div>
        <RulesControls />
        {filters && (
          <div className="ml-auto">
            <FilterControls
              filters={filters}
              displayControlPanel={displayControlPanel}
              setDisplayControlPanel={setDisplayControlPanel}
              dataType={dataType}
              resourceId={resourceId}
              disabled={!filters}
            />
          </div>
        )}
      </div>
      {displayControlPanel && filters && (
        <div className="fixed right-0 top-0 z-50 h-screen">
          <ControlPanel
            data-testid="detail-view-control-panel"
            aggregations={aggregations}
            filters={filters}
            setFilters={setFilters}
            toggleDisplay={() => setDisplayControlPanel(false)}
            dataType={dataType}
            showDisplayTrigger={false}
            resourceId={resourceId}
          />
        </div>
      )}
    </ConfigProvider>
  );
}

export default GeneralizationControls;
