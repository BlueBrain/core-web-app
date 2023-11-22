'use client';

import { PrimitiveAtom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import TargetDropdownGroup from './TargetDropdownGroup';
import ParamGroup from './ParamGroup';
import CustomAnalysisDropdown from './CustomAnalysisDropdown';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import type {
  ExpDesignerCustomAnalysisDropdown,
  ExpDesignerGroupParameter,
  ExpDesignerParam,
} from '@/types/experiment-designer';

function ParameterRenderRow({ paramAtom }: { paramAtom: PrimitiveAtom<ExpDesignerParam> }) {
  const [param] = useAtom<ExpDesignerParam>(paramAtom);
  const columnStyle = `${defaultColumnStyle} w-full`;

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

    case 'customAnalysisDropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerCustomAnalysisDropdown>;
      constantCol = <CustomAnalysisDropdown paramAtom={paramAtomTyped} />;
      break;
    }

    default:
      break;
  }

  return <div className={columnStyle}>{constantCol}</div>;
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
