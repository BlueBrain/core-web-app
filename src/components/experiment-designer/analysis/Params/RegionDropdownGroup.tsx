import GenericAddButton from '@/components/experiment-designer/GenericAddButton';
import type {
  ExpDesignerRegionDropdownGroupParameter,
  ExpDesignerRegionParameter,
} from '@/types/experiment-designer';
import { classNames } from '@/util/utils';
import { BrainRegionsDropdown } from '@/components/experiment-designer';
import { subheaderStyle } from '@/components/experiment-designer/GenericParamWrapper';

type Props = {
  data: ExpDesignerRegionDropdownGroupParameter;
  className?: string;
};

export default function RegionDropdownGroup({ data, className }: Props) {
  return (
    <>
      <div className={subheaderStyle}>{data.name}</div>

      {data.value.map((regionDropdownElement: ExpDesignerRegionParameter) => (
        <div className={classNames('flex gap-3', className)} key={regionDropdownElement.id}>
          <div className="grow font-bold">{regionDropdownElement.name}</div>
          <BrainRegionsDropdown defaultValue={regionDropdownElement.value} />
        </div>
      ))}

      <GenericAddButton onClick={() => {}} title="Add Recording" />
    </>
  );
}
