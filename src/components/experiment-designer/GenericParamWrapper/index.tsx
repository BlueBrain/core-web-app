'use client';

import { Divider } from 'antd';
import { ComponentType, ReactNode, useMemo } from 'react';
import { splitAtom } from 'jotai/utils';
import { Atom, useAtomValue } from 'jotai';

import { ExpDesignerParam } from '@/types/experiment-designer';
import { getFocusedAtom } from '@/components/experiment-designer/utils';

export const defaultPadding = 'py-[12px] px-[16px]'; // to match the collapse padding
export const defaultColumnStyle = 'w-1/2 align-baseline text-primary-7';
export const headerStyle = 'p-[16px] font-light text-left';
export const subheaderStyle = `${defaultPadding} uppercase text-gray-400`;

type RowRendererProps = {
  paramAtom: Atom<ExpDesignerParam>;
};

type Props = {
  description: string;
  RowRenderer: ComponentType<RowRendererProps>;
  sectionName: string;
  children?: ReactNode;
  showHeader?: boolean;
};

export const generateId = (param1: string, param2: string) =>
  `${param1.replaceAll(' ', '')}${param2.replaceAll(' ', '')}`;

export default function GenericParamWrapper({
  description,
  RowRenderer,
  children,
  showHeader = true,
  sectionName,
}: Props) {
  const focusedAtom = useMemo(() => getFocusedAtom(sectionName), [sectionName]);
  const atoms = useMemo(() => splitAtom(focusedAtom), [focusedAtom]);
  const listAtoms = useAtomValue(atoms);

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
          {!listAtoms.length && (
            <tr>
              <td className={defaultColumnStyle}>Fetching info...</td>
              <td className={defaultColumnStyle}>Fetching info...</td>
            </tr>
          )}

          {listAtoms.length &&
            listAtoms.map((paramAtom) => (
              <RowRenderer key={paramAtom.toString()} paramAtom={paramAtom} />
            ))}
        </tbody>
      </table>

      {children}
    </div>
  );
}
