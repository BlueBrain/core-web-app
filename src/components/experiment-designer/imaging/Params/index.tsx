'use client';

import { Atom, useAtom } from 'jotai';

import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import { CoordinatesViewer, RadioButtonParameter } from '@/components/experiment-designer';
import type { ExpDesignerParam } from '@/types/experiment-designer';

function ParameterRenderRow({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const [param] = useAtom<ExpDesignerParam>(paramAtom);
  let constantCol;
  switch (param.type) {
    case 'position':
      constantCol = <CoordinatesViewer paramAtom={paramAtom} className={defaultPadding} />;
      break;

    case 'radioButton':
      constantCol = <RadioButtonParameter paramAtom={paramAtom} className={defaultPadding} />;
      break;

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

export default function Params() {
  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      sectionName="imaging"
      RowRenderer={ParameterRenderRow}
      showHeader={false}
    />
  );
}
