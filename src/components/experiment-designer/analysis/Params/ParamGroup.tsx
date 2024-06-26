import { Atom, PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import TargetSelector from './PopulationRegionSelector';
import CheckboxGroup from './CheckboxGroup';
import type {
  ExpDesignerCheckboxGroupParameter,
  ExpDesignerGroupParameter,
  ExpDesignerNumberParameter,
  ExpDesignerParam,
  ExpDesignerTargetParameter,
} from '@/types/experiment-designer';
import { ConstantParameter } from '@/components/experiment-designer';
import {
  subheaderStyle,
  defaultPadding,
  generateId,
  disabledParamStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import { getSubGroupFocusedAtom } from '@/components/experiment-designer/utils';

function ParameterRenderRow({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const data = useAtomValue(paramAtom);
  const defaultStyle = `${defaultPadding} ${data.disabled ? disabledParamStyle : ''}`;

  let constantCol;
  switch (data.type) {
    case 'targetDropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerTargetParameter>;
      constantCol = <TargetSelector paramAtom={paramAtomTyped} className={defaultStyle} />;
      break;
    }

    case 'checkboxGroup': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerCheckboxGroupParameter>;
      constantCol = <CheckboxGroup paramAtom={paramAtomTyped} className={defaultStyle} />;
      break;
    }

    case 'number': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerNumberParameter>;
      constantCol = (
        <ConstantParameter
          paramAtom={paramAtomTyped}
          className={defaultStyle}
          showSwitcher={false}
        />
      );
      break;
    }

    default:
      break;
  }

  return <div>{constantCol}</div>;
}

export default function ParamGroup({
  paramAtom,
}: {
  paramAtom: PrimitiveAtom<ExpDesignerGroupParameter>;
}) {
  const data = useAtomValue(paramAtom);

  const focusedAtom = useMemo(() => getSubGroupFocusedAtom(paramAtom), [paramAtom]);
  const atoms = useMemo(() => splitAtom(focusedAtom), [focusedAtom]);
  const [listAtoms] = useAtom(atoms);

  return (
    <>
      <div className={subheaderStyle}>{data.name}</div>

      {listAtoms.map((itemAtom) => (
        <ParameterRenderRow paramAtom={itemAtom} key={generateId(data.id, itemAtom.toString())} />
      ))}
    </>
  );
}
