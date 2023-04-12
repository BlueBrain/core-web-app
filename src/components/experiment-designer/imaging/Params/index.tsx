'use client';

import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import { asyncExpDesignerConfigAtom } from '@/state/experiment-designer';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import { CoordinatesViewer, RadioButtonParameter } from '@/components/experiment-designer';
import type { ExpDesignerParam } from '@/types/experiment-designer';

function ParameterRenderRow({ data }: { data: ExpDesignerParam }) {
  let constantCol;
  switch (data.type) {
    case 'position':
      constantCol = <CoordinatesViewer data={data} className={defaultPadding} />;
      break;

    case 'radioButton':
      constantCol = <RadioButtonParameter data={data} className={defaultPadding} />;
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

  const imaging =
    expDesignConfigLoadable.state === 'hasData' ? expDesignConfigLoadable.data.imaging : [];

  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      paramList={imaging}
      RowRenderer={ParameterRenderRow}
      showHeader={false}
    />
  );
}
