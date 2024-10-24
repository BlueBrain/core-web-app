'use client';

import { PrimitiveAtom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import TargetSelector from '@/components/experiment-designer/experiment-setup/Params/TargetSelector';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import {
  ConstantParameter,
  RangeParameter,
  DefaultEmptyParam,
} from '@/components/experiment-designer';
import type {
  ExpDesignerNumberParameter,
  ExpDesignerParam,
  ExpDesignerRangeParameter,
  ExpDesignerTargetDropdownGroupParameter,
  ExpDesignerTargetParameter,
} from '@/types/experiment-designer';
import { applySwapFunction } from '@/components/experiment-designer/utils';
import MultiTargetDropdown from '@/components/experiment-designer/MultiTargetDropdown';

function ParameterRenderRow({ paramAtom }: { paramAtom: PrimitiveAtom<ExpDesignerParam> }) {
  const [param, setParam] = useAtom(paramAtom);
  const columnStyle = `${defaultColumnStyle} w-1/2`;

  const changed = () => {
    const newSwapParam = applySwapFunction(param);
    if (!newSwapParam) return;

    setParam(newSwapParam);
  };

  let constantCol;
  let sweepCol;
  switch (param.type) {
    case 'number': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerNumberParameter>;
      constantCol = (
        <ConstantParameter
          paramAtom={paramAtomTyped}
          className={defaultPadding}
          onChangeParamType={changed}
        />
      );
      sweepCol = <DefaultEmptyParam />;
      break;
    }

    case 'range': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerRangeParameter>;
      constantCol = <DefaultEmptyParam />;
      sweepCol = <RangeParameter paramAtom={paramAtomTyped} onChangeParamType={changed} />;
      break;
    }

    case 'targetDropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerTargetParameter>;
      constantCol = (
        <TargetSelector
          paramAtom={paramAtomTyped}
          className={defaultPadding}
          onChangeParamType={changed}
        />
      );
      sweepCol = <DefaultEmptyParam />;
      break;
    }

    case 'targetDropdownGroup': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerTargetDropdownGroupParameter>;
      constantCol = <DefaultEmptyParam />;
      sweepCol = (
        <MultiTargetDropdown
          paramAtom={paramAtomTyped}
          className={defaultPadding}
          onChangeParamType={changed}
        />
      );
      break;
    }

    default:
      break;
  }

  return (
    <div className="flex">
      <div className={columnStyle}>{constantCol}</div>
      <div className={columnStyle}>{sweepCol}</div>
    </div>
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
      description="Define the experiment global parameters."
      listAtoms={listAtoms}
      RowRenderer={ParameterRenderRow}
    />
  );
}
