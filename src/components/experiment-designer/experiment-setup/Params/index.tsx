'use client';

import { Divider } from 'antd';
import { ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import {
  ConstantParameter,
  RangeParameter,
  StringParameter,
  DropdownParameter,
} from '@/components/experiment-designer';
import TargetRegionSelector from '@/components/experiment-designer/experiment-setup/Params/TargetRegionSelector';
import { expDesignerConfigAtom } from '@/state/experiment-designer';

const defaultPadding = 'py-[12px]'; // to match the collapse padding
const defaultNAParam = <div className={defaultPadding}>---</div>;
const defaultColumnStyle = 'w-1/2 align-baseline px-[16px] text-primary-7';
const headerStyle = 'p-[16px] font-light text-left';

function ParameterRenderRow({ data }: { data: any }) {
  const columns: ReactNode[] = [];

  switch (data.type) {
    case 'number':
      columns.push(<ConstantParameter data={data} />);
      columns.push(defaultNAParam);
      break;

    case 'string':
      columns.push(<StringParameter data={data} className={defaultPadding} />);
      columns.push(defaultNAParam);
      break;

    case 'dropdown':
      columns.push(<DropdownParameter data={data} className={defaultPadding} />);
      columns.push(defaultNAParam);
      break;

    case 'regionDropdown':
      columns.push(<TargetRegionSelector data={data} className={defaultPadding} />);
      columns.push(defaultNAParam);
      break;

    case 'range':
      columns.push(defaultNAParam);
      columns.push(<RangeParameter data={data} />);
      break;

    default:
      break;
  }

  return (
    <tr>
      <td className={defaultColumnStyle}>{columns[0]}</td>
      <td className={defaultColumnStyle}>{columns[1]}</td>
    </tr>
  );
}

const loadableExpDesignConfigAtom = loadable(expDesignerConfigAtom);

export default function Params() {
  const expDesignConfigLoadable = useAtomValue(loadableExpDesignConfigAtom);

  const setup =
    expDesignConfigLoadable.state === 'hasData' ? expDesignConfigLoadable.data.setup : [];

  return (
    <div className="h-full">
      <div className="text-sky-800 p-6">
        Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
        sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate.
      </div>

      <div className="px-6">
        <Divider />
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th className={headerStyle}>CONSTANT PARAMETERS</th>
            <th className={headerStyle}>PARAMETER SWEEPS</th>
          </tr>
        </thead>

        <tbody>
          {!setup.length && (
            <tr>
              <td className={defaultColumnStyle}>Fetching info...</td>
              <td className={defaultColumnStyle}>Fetching info...</td>
            </tr>
          )}
          {setup.map((param) => (
            <ParameterRenderRow key={param.id} data={param} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
