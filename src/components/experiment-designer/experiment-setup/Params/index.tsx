'use client';

import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import TargetRegionSelector from '@/components/experiment-designer/experiment-setup/Params/TargetRegionSelector';
import { expDesignerConfigAtom } from '@/state/experiment-designer';
import GenericParamWrapper, {
  defaultColumnsMapper,
  defaultPadding,
  defaultNAParam,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';

function ParameterRenderRow({ data }: { data: any }) {
  let [constantCol, sweepCol] = defaultColumnsMapper[data.type];

  if (!constantCol || !sweepCol) {
    if (data.type === 'regionDropdown') {
      constantCol = <TargetRegionSelector data={data} className={defaultPadding} />;
      sweepCol = defaultNAParam;
    }
  }

  return (
    <tr>
      <td className={defaultColumnStyle}>{constantCol}</td>
      <td className={defaultColumnStyle}>{sweepCol}</td>
    </tr>
  );
}

const loadableExpDesignConfigAtom = loadable(expDesignerConfigAtom);

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
