'use client';

import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import RegionDropdownGroup from './RegionDropdownGroup';
import ParamGroup from './ParamGroup';
import { asyncExpDesignerConfigAtom } from '@/state/experiment-designer';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import type { ExpDesignerParam } from '@/types/experiment-designer';

function ParameterRenderRow({ data }: { data: ExpDesignerParam }) {
  let constantCol;
  switch (data.type) {
    case 'regionDropdownGroup':
      constantCol = <RegionDropdownGroup data={data} className={defaultPadding} />;
      break;

    case 'group':
      constantCol = <ParamGroup data={data} />;
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

const loadableExpDesignConfigAtom = loadable(asyncExpDesignerConfigAtom);

export default function Params() {
  const expDesignConfigLoadable = useAtomValue(loadableExpDesignConfigAtom);

  const analysis =
    expDesignConfigLoadable.state === 'hasData' ? expDesignConfigLoadable.data.analysis : [];

  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      paramList={analysis}
      RowRenderer={ParameterRenderRow}
      showHeader={false}
    />
  );
}
