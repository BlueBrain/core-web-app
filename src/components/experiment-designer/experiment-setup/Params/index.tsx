'use client';

import { Divider } from 'antd';

import ConstantParameter from '@/components/experiment-designer/ConstantParameter';
import paramsDummyData from '@/components/experiment-designer/experiment-designer-dummy.json';

function ParameterRenderConstants({ data }: { data: any }) {
  if (data.type === 'number') {
    return <ConstantParameter data={data} />;
  }
  return <div>---</div>;
}

export default function Params() {
  const { setup } = paramsDummyData;
  return (
    <div className="h-full p-10">
      <div className="text-sky-800">
        Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
        sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate.
      </div>

      <Divider />

      <div className="flex gap-8">
        <div className="lg:w-1/2 md:w-full">
          <h4 className="py-8">CONSTANT PARAMETERS</h4>
          <div className="flex flex-col">
            {setup.map((param) => (
              <ParameterRenderConstants key={param.id} data={param} />
            ))}
          </div>
        </div>
        <div className="lg:w-1/2 md:w-full">
          <h4 className="py-8">PARAMETER SWEEPS</h4>
        </div>
      </div>
    </div>
  );
}
