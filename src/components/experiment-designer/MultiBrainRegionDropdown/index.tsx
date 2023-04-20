import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import { ImportOutlined } from '@ant-design/icons';
import { loadable } from 'jotai/utils';

import { Select } from 'antd';
import type {
  ExpDesignerRegionDropdownGroupParameter,
  ExpDesignerRegionParameter,
} from '@/types/experiment-designer';
import { classNames } from '@/util/utils';
import { getNewTargetObj } from '@/components/experiment-designer/defaultNewObject';
import { BrainRegion } from '@/types/ontologies';
import { brainRegionsAtom } from '@/state/brain-regions';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerRegionDropdownGroupParameter>;
  className?: string;
  showSwitcher?: boolean;
  onChangeParamType?: () => void;
};

const loadableBrainRegionsAtom = loadable(brainRegionsAtom);

export default function MultiBrainRegionDropdown({
  paramAtom,
  className,
  showSwitcher = true,
  onChangeParamType,
}: Props) {
  const [data, setData] = useAtom(paramAtom);

  const brainRegionsLoadable = useAtomValue(loadableBrainRegionsAtom);

  const brainRegions = brainRegionsLoadable.state === 'hasData' ? brainRegionsLoadable.data : [];

  const options = brainRegions?.map((region) => ({
    value: region.id,
    label: region.title,
    region,
  }));

  const initialRegionId = data.value[0]?.brainRegionId.toString();

  const onAdd = (regionId: string, { region }: { region: BrainRegion }) => {
    if (!regionId) return;

    const newRegionElement: ExpDesignerRegionParameter = {
      ...getNewTargetObj(),
      brainRegionId: parseInt(region.id, 10),
      value: region.title,
    };
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: [...oldAtomData.value, newRegionElement],
    }));
  };

  const onRemove = (regionId: string) => {
    if (!regionId) return;

    const regionIdNum = parseInt(regionId, 10);
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: oldAtomData.value.filter((r) => r.brainRegionId !== regionIdNum),
    }));
  };

  return (
    <div className={classNames('flex gap-3', className)}>
      <div className="grow font-bold">{data.name}</div>
      {!options?.length && 'Loading...'}
      {options?.length && (
        <Select
          mode="multiple"
          defaultValue={initialRegionId}
          size="small"
          options={options}
          onSelect={onAdd}
          onDeselect={onRemove}
          style={{ width: 200 }}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      )}
      {showSwitcher && <ImportOutlined onClick={onChangeParamType} />}
    </div>
  );
}
