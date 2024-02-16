import { useAtomValue } from 'jotai';

import { dataTabAtom } from './DataTypeTabs';
import DataTypeGroupTotals from './DataTypeGroupTotals';
import LiteratureForExperimentType from './LiteratureForExperimentType';
import { DataTypeGroup } from '@/types/explore-section/data-types';

export default function DataTypeStatsPanel() {
  const dataTypeActiveTab = useAtomValue(dataTabAtom);
  let component: JSX.Element | null = null;

  if (dataTypeActiveTab === 'experimental-data') {
    component = <DataTypeGroupTotals dataTypeGroup={DataTypeGroup.ExperimentalData} />;
  }
  if (dataTypeActiveTab === 'model-data') {
    component = <DataTypeGroupTotals dataTypeGroup={DataTypeGroup.ModelData} />;
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
