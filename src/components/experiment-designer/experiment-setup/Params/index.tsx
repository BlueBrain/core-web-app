'use client';

import { Atom, useAtom } from 'jotai';

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
import type { ExpDesignerParam } from '@/types/experiment-designer';

function ParameterRenderRow({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const [param] = useAtom<ExpDesignerParam>(paramAtom);

  let constantCol;
  let sweepCol;
  switch (param.type) {
    case 'number':
      constantCol = <ConstantParameter data={param} className={defaultPadding} />;
      sweepCol = <DefaultEmptyParam />;
      break;

    case 'range':
      constantCol = <DefaultEmptyParam />;
      sweepCol = <RangeParameter data={param} />;
      break;

    case 'regionDropdown':
      constantCol = <TargetRegionSelector data={param} className={defaultPadding} />;
      sweepCol = <DefaultEmptyParam />;
      break;

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

export default function Params() {
  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      sectionName="setup"
      RowRenderer={ParameterRenderRow}
    />
  );
}
