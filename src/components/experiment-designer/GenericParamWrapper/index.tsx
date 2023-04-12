'use client';

import { Divider } from 'antd';
import { ComponentType, ReactNode } from 'react';

import { ExpDesignerParam, ExpDesignerListParam } from '@/types/experiment-designer';

export const defaultPadding = 'py-[12px] px-[16px]'; // to match the collapse padding
export const defaultColumnStyle = 'w-1/2 align-baseline text-primary-7';
export const headerStyle = 'p-[16px] font-light text-left';
export const subheaderStyle = `${defaultPadding} uppercase text-gray-400`;

type RowRendererProps = {
  data: any;
};

type Props = {
  description: string;
  paramList: ExpDesignerParam[] | ExpDesignerListParam[];
  RowRenderer: ComponentType<RowRendererProps>;
  children?: ReactNode;
  showHeader?: boolean;
};

export const generateId = (param1: string, param2: string) =>
  `${param1.replaceAll(' ', '')}${param2.replaceAll(' ', '')}`;

function isEmpty(data: ExpDesignerParam[] | ExpDesignerListParam[]) {
  if (typeof data !== 'object') return true;
  return !data.length;
}

export default function GenericParamWrapper({
  description,
  paramList,
  RowRenderer,
  children,
  showHeader = true,
}: Props) {
  const paramEmpty = isEmpty(paramList);
  return (
    <div className="h-full">
      <div className="text-sky-800 p-6">{description}</div>

      <div className="px-6">
        <Divider />
      </div>

      <table className="w-full">
        {showHeader && (
          <thead>
            <tr>
              <th className={headerStyle}>CONSTANT PARAMETERS</th>
              <th className={headerStyle}>PARAMETER SWEEPS</th>
            </tr>
          </thead>
        )}

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

      {children}
    </div>
  );
}
