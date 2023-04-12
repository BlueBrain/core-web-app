import { Atom, useAtomValue } from 'jotai';

import TargetRegionSelector from './PopulationRegionSelector';
import CheckboxGroup from './CheckboxGroup';
import type { ExpDesignerGroupParameter, ExpDesignerParam } from '@/types/experiment-designer';
import { ConstantParameter } from '@/components/experiment-designer';
import {
  subheaderStyle,
  defaultPadding,
  generateId,
} from '@/components/experiment-designer/GenericParamWrapper';

function ParameterRenderRow({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const data = useAtomValue(paramAtom);

  let constantCol;
  switch (data.type) {
    case 'regionDropdown':
      constantCol = <TargetRegionSelector paramAtom={paramAtom} className={defaultPadding} />;
      break;

    case 'checkboxGroup':
      constantCol = <CheckboxGroup paramAtom={paramAtom} className={defaultPadding} />;
      break;

    case 'number':
      constantCol = (
        <ConstantParameter paramAtom={paramAtom} className={defaultPadding} showSwitcher={false} />
      );
      break;

    default:
      break;
  }

  return <div>{constantCol}</div>;
}

export default function ParamGroup({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const data = useAtomValue(paramAtom as Atom<ExpDesignerGroupParameter>);

  return (
    <>
      <div className={subheaderStyle}>{data.name}</div>

      {data.value.map((item) => (
        <ParameterRenderRow paramAtom={paramAtom} key={generateId(data.id, item.id)} />
      ))}
    </>
  );
}
