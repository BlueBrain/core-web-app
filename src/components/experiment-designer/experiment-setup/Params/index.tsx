'use client';

import { Divider } from 'antd';

import { ReactNode } from 'react';
import ConstantParameter from '@/components/experiment-designer/ConstantParameter';
import paramsDummyData from '@/components/experiment-designer/experiment-designer-dummy.json';
import RangeParameter from '@/components/experiment-designer/RangeParameter';

const defaultPadding = 'py-[12px]'; // to match the collapse padding
const defaultNAParam = <div className={defaultPadding}>---</div>;
const defaultColumnStyle = 'w-1/2 align-baseline px-[16px]';

function ParameterRenderRow({ data }: { data: any }) {
  const columns: ReactNode[] = [];

  switch (data.type) {
    case 'number':
      columns.push(<ConstantParameter data={data} />);
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

export default function Params() {
  const { setup } = paramsDummyData;
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
            <th>CONSTANT PARAMETERS</th>
            <th>PARAMETER SWEEPS</th>
          </tr>
        </thead>

        <tbody>
          {setup.map((param) => (
            <ParameterRenderRow key={param.id} data={param} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
