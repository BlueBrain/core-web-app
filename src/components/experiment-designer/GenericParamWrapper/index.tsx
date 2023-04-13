'use client';

import { Divider } from 'antd';
import { ComponentType, ReactNode, useMemo } from 'react';
import { splitAtom } from 'jotai/utils';
import { Atom, useAtom } from 'jotai';

import { ExpDesignerGroupParameter, ExpDesignerParam } from '@/types/experiment-designer';
import { getSubGroupFocusedAtom } from '@/components/experiment-designer/utils';

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
  listAtoms: Atom<ExpDesignerParam>[];
  children?: ReactNode;
  showHeader?: boolean;
  isGroup?: boolean;
};

export const generateId = (param1: string, param2: string) =>
  `${param1.replaceAll(' ', '')}${param2.replaceAll(' ', '')}`;

type GroupRendererProps = {
  paramAtom: Atom<ExpDesignerGroupParameter>;
  RowRenderer: ComponentType<RowRendererProps>;
};

function GroupRenderer({ paramAtom, RowRenderer }: GroupRendererProps) {
  const focusedAtom = useMemo(() => getSubGroupFocusedAtom(paramAtom), [paramAtom]);
  const atoms = useMemo(() => splitAtom(focusedAtom), [focusedAtom]);
  const [listAtoms] = useAtom(atoms);

  return (
    <>
      {listAtoms.map((rowAtom) => (
        <RowRenderer paramAtom={rowAtom} key={paramAtom.toString() + rowAtom.toString()} />
      ))}
      <tr>
        <td>
          <Divider />
        </td>
        <td>
          <Divider />
        </td>
      </tr>
    </>
  );
}

export default function GenericParamWrapper({
  description,
  RowRenderer,
  children,
  showHeader = true,
  listAtoms,
  isGroup = false,
}: Props) {
  let rows;
  if (listAtoms.length) {
    if (isGroup) {
      rows = listAtoms.map((paramAtom) => {
        const paramAtomTyped = paramAtom as Atom<ExpDesignerGroupParameter>;
        return (
          <GroupRenderer
            key={paramAtom.toString()}
            paramAtom={paramAtomTyped}
            RowRenderer={RowRenderer}
          />
        );
      });
    } else {
      rows = listAtoms.map((paramAtom) => (
        <RowRenderer key={paramAtom.toString()} paramAtom={paramAtom} />
      ));
    }
  } else {
    rows = null;
  }

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

          {rows}
        </tbody>
      </table>

      {children}
    </div>
  );
}
