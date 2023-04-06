import TargetRegionSelector from './PopulationRegionSelector';
import CheckboxGroup from './CheckboxGroup';
import type { ExpDesignerGroupParameter, ExpDesignerParam } from '@/types/experiment-designer';
import { ConstantParameter } from '@/components/experiment-designer';
import {
  subheaderStyle,
  defaultPadding,
  generateId,
} from '@/components/experiment-designer/GenericParamWrapper';

type Props = {
  data: ExpDesignerGroupParameter;
};

function ParameterRenderRow({ data }: { data: ExpDesignerParam }) {
  let constantCol;
  switch (data.type) {
    case 'regionDropdown':
      constantCol = <TargetRegionSelector data={data} className={defaultPadding} />;
      break;

    case 'checkboxGroup':
      constantCol = <CheckboxGroup data={data} className={defaultPadding} />;
      break;

    case 'number':
      constantCol = (
        <ConstantParameter data={data} className={defaultPadding} showSwitcher={false} />
      );
      break;

    default:
      break;
  }

  return <div>{constantCol}</div>;
}

export default function ParamGroup({ data }: Props) {
  return (
    <>
      <div className={subheaderStyle}>{data.name}</div>

      {data.value.map((item) => (
        <ParameterRenderRow data={item} key={generateId(data.id, item.id)} />
      ))}
    </>
  );
}
