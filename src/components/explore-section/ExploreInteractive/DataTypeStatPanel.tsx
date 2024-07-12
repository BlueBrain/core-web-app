import { useAtomValue } from 'jotai';

import { dataTabAtom } from './DataTypeTabs';
import DataTypeGroupTotals from './DataTypeGroupTotals';
import LiteratureForExperimentType from './LiteratureForExperimentType';
import { DataTypeGroup } from '@/types/explore-section/data-types';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

type DataTypeStatsPanelProps = {
  virtualLabInfo?: VirtualLabInfo;
};

export default function DataTypeStatsPanel({ virtualLabInfo }: DataTypeStatsPanelProps) {
  const dataTypeActiveTab = useAtomValue(dataTabAtom);
  let component: JSX.Element | null = null;

  if (dataTypeActiveTab === 'experimental-data') {
    component = (
      <DataTypeGroupTotals
        dataTypeGroup={DataTypeGroup.ExperimentalData}
        virtualLabInfo={virtualLabInfo}
      />
    );
  }
  if (dataTypeActiveTab === 'model-data') {
    component = (
      <DataTypeGroupTotals
        dataTypeGroup={DataTypeGroup.ModelData}
        virtualLabInfo={virtualLabInfo}
      />
    );
  }
  if (dataTypeActiveTab === 'literature') {
    component = <LiteratureForExperimentType />;
  }

  return (
    <div className="relative grid h-full grid-flow-row grid-cols-2 gap-x-3 gap-y-1 p-4 pt-0">
      {component}
    </div>
  );
}
