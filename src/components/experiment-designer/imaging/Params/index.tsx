'use client';

import { Atom, PrimitiveAtom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import { CoordinatesViewer, RadioButtonParameter } from '@/components/experiment-designer';
import type {
  ExpDesignerParam,
  ExpDesignerPositionParameter,
  ExpDesignerRadioBtnParameter,
} from '@/types/experiment-designer';

function ParameterRenderRow({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const [param] = useAtom<ExpDesignerParam>(paramAtom);

  let constantCol;
  switch (param.type) {
    case 'position': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerPositionParameter>;
      constantCol = <CoordinatesViewer paramAtom={paramAtomTyped} className={defaultPadding} />;
      break;
    }

    case 'radioButton': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerRadioBtnParameter>;
      constantCol = <RadioButtonParameter paramAtom={paramAtomTyped} className={defaultPadding} />;
      break;
    }

    default:
      break;
  }

  return (
    <tr>
      <td className={defaultColumnStyle}>{constantCol}</td>
      <td />
    </tr>
  );
}

type Props = {
  focusedAtom: PrimitiveAtom<ExpDesignerParam[]>;
};

export default function Params({ focusedAtom }: Props) {
  const atoms = useMemo(() => splitAtom(focusedAtom), [focusedAtom]);
  const [listAtoms] = useAtom(atoms);

  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      listAtoms={listAtoms}
      RowRenderer={ParameterRenderRow}
      showHeader={false}
    />
  );
}
