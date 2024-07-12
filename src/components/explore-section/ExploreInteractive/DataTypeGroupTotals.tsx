'use client';

import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { usePathname } from 'next/navigation';

import StatItem, { StatError, StatItemSkeleton } from './StatItem';
import { DataType } from '@/constants/explore-section/list-views';
import { DataTypeGroup } from '@/types/explore-section/data-types';
import { DATA_TYPE_GROUPS_CONFIG } from '@/constants/explore-section/data-type-groups';
import { totalByExperimentAndRegionsAtom } from '@/state/explore-section/list-view-atoms';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/data-types';
import { ExploreDataScope } from '@/types/explore-section/application';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

function DataTypeGroupTotal({
  dataType,
  basePath,
  virtualLabInfo,
}: {
  dataType: DataType;
  basePath: string;
  virtualLabInfo?: VirtualLabInfo;
}) {
  const dataScope = ExploreDataScope.SelectedBrainRegion;

  const total = useAtomValue(
    loadable(totalByExperimentAndRegionsAtom({ dataType, dataScope, virtualLabInfo }))
  );

  const statValue = total.state === 'hasData' ? total?.data || 0 : 0;
  const records = `${statValue} record${statValue > 0 ? 's' : ''}`;
  return (
    <>
      {total.state === 'loading' && <StatItemSkeleton />}
      {total.state === 'hasError' && (
        <StatError
          text={`'Error loading experiment datasets for ${DATA_TYPES_TO_CONFIGS[dataType].title}.`}
        />
      )}

      {total.state === 'hasData' && (
        <StatItem
          href={`${basePath}/${DATA_TYPES_TO_CONFIGS[dataType].name}`}
          key={DATA_TYPES_TO_CONFIGS[dataType].title}
          title={DATA_TYPES_TO_CONFIGS[dataType].title}
          subtitle={records}
          testId={`experiment-dataset-${dataType}`}
        />
      )}
    </>
  );
}

export default function DataTypeGroupTotals({
  dataTypeGroup,
  virtualLabInfo,
}: {
  dataTypeGroup: DataTypeGroup;
  virtualLabInfo?: VirtualLabInfo;
}) {
  const { config, extensionPath } = DATA_TYPE_GROUPS_CONFIG[dataTypeGroup];
  const pathName = usePathname();
  return (
    <>
      {Object.keys(config).map((dataType) => (
        <DataTypeGroupTotal
          key={dataType}
          dataType={dataType as DataType}
          basePath={`${pathName}/${extensionPath}`}
          virtualLabInfo={virtualLabInfo}
        />
      ))}
    </>
  );
}
