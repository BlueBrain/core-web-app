'use client';

import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import TargetRegionSelector from '@/components/experiment-designer/experiment-setup/Params/TargetRegionSelector';
import { asyncExpDesignerConfigAtom } from '@/state/experiment-designer';
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

function ParameterRenderRow({ data }: { data: ExpDesignerParam }) {
  let constantCol;
  let sweepCol;
  switch (data.type) {
    case 'number':
      constantCol = <ConstantParameter data={data} className={defaultPadding} />;
      sweepCol = <DefaultEmptyParam />;
      break;

    case 'range':
      constantCol = <DefaultEmptyParam />;
      sweepCol = <RangeParameter data={data} className={defaultPadding} />;
      break;

    case 'regionDropdown':
      constantCol = <TargetRegionSelector data={data} className={defaultPadding} />;
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

const loadableExpDesignConfigAtom = loadable(asyncExpDesignerConfigAtom);

export default function Params() {
  const expDesignConfigLoadable = useAtomValue(loadableExpDesignConfigAtom);

  const setup =
    expDesignConfigLoadable.state === 'hasData' ? expDesignConfigLoadable.data.setup : [];

  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      paramList={setup}
      RowRenderer={ParameterRenderRow}
    />
  );
}
