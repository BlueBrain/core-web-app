'use client';

import { Divider } from 'antd';
import { ComponentType, ReactNode, useMemo } from 'react';
import { splitAtom } from 'jotai/utils';
import { PrimitiveAtom, useAtomValue } from 'jotai';

import DeleteGroupBtn from './DeleteGroupBtn';
import NameGroupEditor from './NameGroupEditor';
import { ExpDesignerGroupParameter, ExpDesignerParam } from '@/types/experiment-designer';
import { getSubGroupFocusedAtom } from '@/components/experiment-designer/utils';

export const defaultPadding = 'py-[12px] px-[14px]'; // to match the collapse padding
export const defaultColumnStyle = 'w-1/2 align-baseline text-primary-7';
export const headerStyle = 'w-1/2 p-[16px] font-light text-left';
export const subheaderStyle = `${defaultPadding} uppercase text-gray-400`;
export const disabledParamStyle = 'opacity-30 cursor-not-allowed pointer-events-none';
const overflowStyle = 'max-h-[92vh] overflow-y-auto';
const groupBorderStyle = 'border border-transparent group-hover:border-gray-400';

type RowRendererProps = {
  paramAtom: PrimitiveAtom<ExpDesignerParam>;
};

type Props = {
  description: string | ReactNode;
  RowRenderer: ComponentType<RowRendererProps>;
  listAtoms: PrimitiveAtom<ExpDesignerParam>[] | undefined;
  children?: ReactNode;
  showHeader?: boolean;
  onRemoveGroup?: (atom: PrimitiveAtom<ExpDesignerParam> | null) => void;
  isGroup?: boolean;
  namePrefix?: string;
};

export const generateId = (param1: string, param2: string) =>
  `${param1.replaceAll(' ', '')}${param2.replaceAll(' ', '')}`;

type GroupRendererProps = {
  paramAtom: PrimitiveAtom<ExpDesignerGroupParameter>;
  RowRenderer: ComponentType<RowRendererProps>;
  onRemoveGroup: () => void;
  groupIndex: number;
  namePrefix: string;
};

function GroupRenderer({
  paramAtom,
  RowRenderer,
  onRemoveGroup,
  groupIndex,
  namePrefix,
}: GroupRendererProps) {
  const focusedAtom = useMemo(() => getSubGroupFocusedAtom(paramAtom), [paramAtom]);
  const atoms = useMemo(() => splitAtom(focusedAtom), [focusedAtom]);
  const listAtoms = useAtomValue(atoms);

  return (
    <div className="group flex flex-col">
      <DeleteGroupBtn className={groupBorderStyle} onDelete={onRemoveGroup} />
      <div className={groupBorderStyle}>
        <NameGroupEditor paramAtom={paramAtom} namePrefix={namePrefix} groupIndex={groupIndex} />
        {listAtoms.map((rowAtom) => (
          <RowRenderer paramAtom={rowAtom} key={paramAtom.toString() + rowAtom.toString()} />
        ))}
      </div>
      <Divider />
    </div>
  );
}

export default function GenericParamWrapper({
  description,
  RowRenderer,
  children,
  showHeader = true,
  listAtoms,
  onRemoveGroup,
  isGroup = false,
  namePrefix = '',
}: Props) {
  let rows = null;

  if (listAtoms?.length) {
    if (isGroup) {
      rows = listAtoms.map((paramAtom, index) => {
        const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerGroupParameter>;
        return (
          <GroupRenderer
            key={paramAtom.toString()}
            paramAtom={paramAtomTyped}
            RowRenderer={RowRenderer}
            onRemoveGroup={() => (onRemoveGroup ? onRemoveGroup(paramAtom) : null)}
            groupIndex={index}
            namePrefix={namePrefix}
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
      <div className="p-6 text-sky-800">{description}</div>

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

        {!listAtoms && (
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
