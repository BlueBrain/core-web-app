'use client';

import { PrimitiveAtom, useAtom } from 'jotai';
import { ExportOutlined } from '@ant-design/icons';

import { BrainRegionsDropdown } from '@/components/experiment-designer';
import { ExpDesignerRegionParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';
import { BrainRegion } from '@/types/ontologies';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerRegionParameter>;
  className?: string;
  onChangeParamType?: () => void;
};

export default function TargetRegionSelector({ paramAtom, className, onChangeParamType }: Props) {
  const [data, setData] = useAtom(paramAtom);

  const setSimulateRegions = (newBrainRegion: BrainRegion) => {
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: newBrainRegion.title,
      brainRegionId: parseInt(newBrainRegion.id, 10),
    }));
  };

  return (
    <div className={classNames('flex gap-3 items-center font-bold', className)}>
      <div className="grow">Simulated Neurons</div>
      <BrainRegionsDropdown onChange={setSimulateRegions} defaultValue={data.value} />
      <ExportOutlined onClick={onChangeParamType} />
    </div>
  );
}
