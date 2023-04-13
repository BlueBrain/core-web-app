'use client';

import { Atom, useAtom } from 'jotai';

import RegionDropdownGroup from './RegionDropdownGroup';
import ParamGroup from './ParamGroup';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import type { ExpDesignerParam } from '@/types/experiment-designer';

function ParameterRenderRow({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const [param] = useAtom<ExpDesignerParam>(paramAtom);
  let constantCol;
  switch (param.type) {
    case 'regionDropdownGroup':
      constantCol = <RegionDropdownGroup data={param} className={defaultPadding} />;
      break;

    case 'group':
      constantCol = <ParamGroup data={param} />;
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
      sectionName="analysis"
      RowRenderer={ParameterRenderRow}
      showHeader={false}
    />
  );
}
