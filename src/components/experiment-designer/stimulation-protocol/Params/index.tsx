'use client';

import { Atom, useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import InputTargetRegionSelector from './StimulationTargetRegionSelector';
import GenericAddButton from '@/components/experiment-designer/GenericAddButton';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import {
  ConstantParameter,
  DropdownParameter,
  DefaultEmptyParam,
} from '@/components/experiment-designer';
import type { ExpDesignerParam, ExpDesignerNumberParameter } from '@/types/experiment-designer';
import { getFocusedAtom } from '@/components/experiment-designer/utils';

function StimulationBlock({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const param = useAtomValue<ExpDesignerParam>(paramAtom);

  let constantCol;
  let sweepCol;

  switch (param.type) {
    case 'number': {
      const paramAtomTyped = paramAtom as Atom<ExpDesignerNumberParameter>;
      constantCol = <ConstantParameter paramAtom={paramAtomTyped} className={defaultPadding} />;
      sweepCol = <DefaultEmptyParam />;
      break;
    }

    case 'dropdown':
      constantCol = <DropdownParameter paramAtom={paramAtom} className={defaultPadding} />;
      sweepCol = <DefaultEmptyParam />;
      break;

    case 'regionDropdown':
      constantCol = <InputTargetRegionSelector paramAtom={paramAtom} className={defaultPadding} />;
      sweepCol = <DefaultEmptyParam />;
      break;

    default:
      break;
  }

  return (
    <tr>
      <td className={defaultColumnStyle}>{constantCol}</td>
      <td className={defaultColumnStyle}>{sweepCol}</td>
    </tr>
  );
}

export default function Params() {
  const sectionName = 'stimuli';
  const focusedAtom = useMemo(() => getFocusedAtom(sectionName), [sectionName]);
  const atoms = useMemo(() => splitAtom(focusedAtom), [focusedAtom]);
  const [listAtoms] = useAtom(atoms);

  const addNew = () => {};

  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      listAtoms={listAtoms}
      RowRenderer={StimulationBlock}
      isGroup
    >
      <GenericAddButton onClick={addNew} title="Add Stimulation Protocol" />
    </GenericParamWrapper>
  );
}
