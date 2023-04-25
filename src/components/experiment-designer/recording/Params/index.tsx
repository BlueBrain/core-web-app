'use client';

import { Atom, PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import RecordingTargetSelector from './RecordingTargetSelector';
import GenericAddButton from '@/components/experiment-designer/GenericAddButton';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import { ConstantParameter, DropdownParameter } from '@/components/experiment-designer';
import type {
  ExpDesignerDropdownParameter,
  ExpDesignerNumberParameter,
  ExpDesignerParam,
  ExpDesignerRegionParameter,
} from '@/types/experiment-designer';

import { getNewRecordingObj } from '@/components/experiment-designer/defaultNewObject';

function RecordingBlock({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const param = useAtomValue<ExpDesignerParam>(paramAtom);

  let constantCol;
  switch (param.type) {
    case 'number': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerNumberParameter>;
      constantCol = (
        <ConstantParameter
          paramAtom={paramAtomTyped}
          className={defaultPadding}
          showSwitcher={false}
        />
      );
      break;
    }

    case 'dropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerDropdownParameter>;
      constantCol = (
        <DropdownParameter
          paramAtom={paramAtomTyped}
          className={defaultPadding}
          showSwitcher={false}
        />
      );
      break;
    }

    case 'regionDropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerRegionParameter>;
      constantCol = (
        <RecordingTargetSelector paramAtom={paramAtomTyped} className={defaultPadding} />
      );
      break;
    }

    default:
      break;
  }

  return <div className={defaultColumnStyle}>{constantCol}</div>;
}

type Props = {
  focusedAtom: PrimitiveAtom<ExpDesignerParam[]>;
};

export default function Params({ focusedAtom }: Props) {
  const atoms = useMemo(() => splitAtom(focusedAtom), [focusedAtom]);
  const [listAtoms, dispatch] = useAtom(atoms);

  const addNew = () => {
    dispatch({ type: 'insert', value: getNewRecordingObj() });
  };

  const removeGroup = (groupAtom: PrimitiveAtom<ExpDesignerParam> | null) => {
    if (!groupAtom) return;
    dispatch({ type: 'remove', atom: groupAtom });
  };

  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      listAtoms={listAtoms}
      RowRenderer={RecordingBlock}
      showHeader={false}
      onRemoveGroup={removeGroup}
      isGroup
    >
      <GenericAddButton onClick={addNew} title="Add Recording" />
    </GenericParamWrapper>
  );
}
