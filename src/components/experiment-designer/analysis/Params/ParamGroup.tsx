import { Atom, PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import TargetRegionSelector from './PopulationRegionSelector';
import CheckboxGroup from './CheckboxGroup';
import type {
  ExpDesignerCheckboxGroupParameter,
  ExpDesignerGroupParameter,
  ExpDesignerNumberParameter,
  ExpDesignerParam,
  ExpDesignerRegionParameter,
} from '@/types/experiment-designer';
import { ConstantParameter } from '@/components/experiment-designer';
import {
  subheaderStyle,
  defaultPadding,
  generateId,
} from '@/components/experiment-designer/GenericParamWrapper';
import { getSubGroupFocusedAtom } from '@/components/experiment-designer/utils';

function ParameterRenderRow({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const data = useAtomValue(paramAtom);

  let constantCol;
  switch (data.type) {
    case 'regionDropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerRegionParameter>;
      constantCol = <TargetRegionSelector paramAtom={paramAtomTyped} className={defaultPadding} />;
      break;
    }

    case 'checkboxGroup': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerCheckboxGroupParameter>;
      constantCol = <CheckboxGroup paramAtom={paramAtomTyped} className={defaultPadding} />;
      break;
    }

    case 'number': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerNumberParameter>;
      constantCol = (
        <ConstantParameter
          paramAtom={paramAtomTyped}
          className={defaultPadding}
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
