'use client';

import { PrimitiveAtom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import TargetRegionSelector from '@/components/experiment-designer/experiment-setup/Params/TargetRegionSelector';
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
  ExpDesignerRegionParameter,
} from '@/types/experiment-designer';
import { applySwapFunction } from '@/components/experiment-designer/utils';

function ParameterRenderRow({ paramAtom }: { paramAtom: PrimitiveAtom<ExpDesignerParam> }) {
  const [param, setParam] = useAtom(paramAtom);

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
      sweepCol = <RangeParameter paramAtom={paramAtomTyped} />;
      break;
    }

    case 'regionDropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerRegionParameter>;
      constantCol = <TargetRegionSelector paramAtom={paramAtomTyped} className={defaultPadding} />;
      sweepCol = <DefaultEmptyParam />;
      break;
    }

    default:
      break;
  }

  return (
    <tr>
      <td className={defaultColumnStyle}>{constantCol}</td>
      <td className={defaultColumnStyle}>{sweepCol}</td>
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
    />
  );
}
