'use client';

import { PrimitiveAtom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import TargetDropdownGroup from './TargetDropdownGroup';
import ParamGroup from './ParamGroup';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import type { ExpDesignerGroupParameter, ExpDesignerParam } from '@/types/experiment-designer';

function ParameterRenderRow({ paramAtom }: { paramAtom: PrimitiveAtom<ExpDesignerParam> }) {
  const [param] = useAtom<ExpDesignerParam>(paramAtom);

  let constantCol;
  switch (param.type) {
    case 'targetDropdownGroup':
      constantCol = <TargetDropdownGroup paramAtom={paramAtom} className={defaultPadding} />;
      break;

    case 'group': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerGroupParameter>;
      constantCol = <ParamGroup paramAtom={paramAtomTyped} />;
      break;
    }

    default:
      break;
  }

  return <div className={defaultColumnStyle}>{constantCol}</div>;
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
