'use client';

import { Divider } from 'antd';
import { ComponentType } from 'react';

import { ExpDesignerParam } from '@/types/experiment-designer';

export const defaultPadding = 'py-[12px]'; // to match the collapse padding
export const defaultColumnStyle = 'w-1/2 align-baseline px-[16px] text-primary-7';
export const headerStyle = 'p-[16px] font-light text-left';

type RowRendererProps = {
  data: any;
};

type Props = {
  description: string;
  paramList: ExpDesignerParam[];
  RowRenderer: ComponentType<RowRendererProps>;
};

function isEmpty(data: ExpDesignerParam[]) {
  if (typeof data !== 'object') return true;
  return !data.length;
}

export default function GenericParamWrapper({ description, paramList, RowRenderer }: Props) {
  const paramEmpty = isEmpty(paramList);
  return (
    <div className="h-full">
      <div className="text-sky-800 p-6">{description}</div>

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
          {paramEmpty && (
            <tr>
              <td className={defaultColumnStyle}>Fetching info...</td>
              <td className={defaultColumnStyle}>Fetching info...</td>
            </tr>
          )}
          {!paramEmpty && paramList.map((param) => <RowRenderer key={param.id} data={param} />)}
        </tbody>
      </table>
    </div>
  );
}
