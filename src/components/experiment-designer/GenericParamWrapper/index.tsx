'use client';

import { Divider } from 'antd';
import { ComponentType, ReactNode, useMemo } from 'react';
import { splitAtom } from 'jotai/utils';
import { PrimitiveAtom, useAtom } from 'jotai';

import { ExpDesignerGroupParameter, ExpDesignerParam } from '@/types/experiment-designer';
import { getSubGroupFocusedAtom } from '@/components/experiment-designer/utils';

export const defaultPadding = 'py-[12px] px-[16px]'; // to match the collapse padding
export const defaultColumnStyle = 'w-1/2 align-baseline text-primary-7';
export const headerStyle = 'w-1/2 p-[16px] font-light text-left';
export const subheaderStyle = `${defaultPadding} uppercase text-gray-400`;
const overflowStyle = 'max-h-[92vh] overflow-y-auto';

type RowRendererProps = {
  paramAtom: PrimitiveAtom<ExpDesignerParam>;
};

type Props = {
  description: string;
  RowRenderer: ComponentType<RowRendererProps>;
  listAtoms: PrimitiveAtom<ExpDesignerParam>[] | undefined;
  children?: ReactNode;
  showHeader?: boolean;
  isGroup?: boolean;
};

export const generateId = (param1: string, param2: string) =>
  `${param1.replaceAll(' ', '')}${param2.replaceAll(' ', '')}`;

type GroupRendererProps = {
  paramAtom: PrimitiveAtom<ExpDesignerGroupParameter>;
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
      <Divider />
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
  let rows = null;

  if (listAtoms?.length) {
    if (isGroup) {
      rows = listAtoms.map((paramAtom) => {
        const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerGroupParameter>;
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
  }

  return (
    <div className={overflowStyle}>
      <div className="text-sky-800 p-6">{description}</div>

      <div className="px-6">
        <Divider />
      </div>

      <div className="w-full">
        {showHeader && (
          <div className="flex">
            <div className={headerStyle}>CONSTANT PARAMETERS</div>
            <div className={headerStyle}>PARAMETER SWEEPS</div>
          </div>
        )}

        {!listAtoms?.length && (
          <div className="flex">
            <div className={defaultColumnStyle}>Fetching info...</div>
            <div className={defaultColumnStyle}>Fetching info...</div>
          </div>
        )}

        {rows}
      </div>

      {children}
    </div>
  );
}
