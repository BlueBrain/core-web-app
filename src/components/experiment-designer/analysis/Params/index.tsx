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
import CustomAnalysisSelector from '@/components/experiment-designer/analysis/Params/CustomAnalysisSelector';

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
      description="Define the populations to analyze."
      listAtoms={listAtoms}
      RowRenderer={ParameterRenderRow}
      showHeader={false}
    >
      <CustomAnalysisSelector focusedAtom={focusedAtom} />
    </GenericParamWrapper>
  );
}
