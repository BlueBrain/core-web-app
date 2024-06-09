'use client';

import { Atom, PrimitiveAtom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import { CoordinatesViewer, RadioButtonParameter } from '@/components/experiment-designer';
import type {
  ExpDesignerParam,
  ExpDesignerPositionParameter,
  ExpDesignerRadioBtnParameter,
} from '@/types/experiment-designer';

function ParameterRenderRow({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const [param] = useAtom<ExpDesignerParam>(paramAtom);
  const columnStyle = `${defaultColumnStyle} w-full`;

  let constantCol;
  switch (param.type) {
    case 'position': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerPositionParameter>;
      constantCol = <CoordinatesViewer paramAtom={paramAtomTyped} className={defaultPadding} />;
      break;
    }

    case 'radioButton': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerRadioBtnParameter>;
      constantCol = <RadioButtonParameter paramAtom={paramAtomTyped} className={defaultPadding} />;
      break;
    }

    default:
      break;
  }

  return <div className={columnStyle}>{constantCol}</div>;
}

type Props = {
  focusedAtom: PrimitiveAtom<ExpDesignerParam[]>;
};

export default function Params({ focusedAtom }: Props) {
  const atoms = useMemo(() => splitAtom(focusedAtom), [focusedAtom]);
  const [listAtoms] = useAtom(atoms);

  return (
    <GenericParamWrapper
      description="Configure the generation of movies for the experiment."
      listAtoms={listAtoms}
      RowRenderer={ParameterRenderRow}
      showHeader={false}
    />
  );
}
