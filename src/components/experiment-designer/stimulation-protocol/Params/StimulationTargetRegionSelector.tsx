'use client';

import { useSetAtom } from 'jotai';
import { ExportOutlined } from '@ant-design/icons';

import { expDesignerSimulateRegions } from '@/state/experiment-designer';
import { BrainRegionsDropdown } from '@/components/experiment-designer';
import { ExpDesignerRegionParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  data: ExpDesignerRegionParameter;
  className?: string;
};

export default function StimulationTargetRegionSelector({ data, className }: Props) {
  const setSimulateRegions = useSetAtom(expDesignerSimulateRegions);

  return (
    <div className={classNames('flex gap-3 items-center font-bold', className)}>
      <div className="grow">Target</div>
      <BrainRegionsDropdown onChange={setSimulateRegions} defaultValue={data.value} />
      <ExportOutlined />
    </div>
  );
}
