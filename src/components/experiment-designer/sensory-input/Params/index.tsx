'use client';

import { Atom, useAtomValue, useSetAtom } from 'jotai';

import InputTargetRegionSelector from './InputTargetRegionSelector';
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
import type { ExpDesignerParam } from '@/types/experiment-designer';
import { getFocusedAtom, cloneLastAndAdd } from '@/components/experiment-designer/utils';

function InputBlock({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const param = useAtomValue<ExpDesignerParam>(paramAtom);

  let constantCol;
  let sweepCol;
  switch (param.type) {
    case 'number':
      constantCol = <ConstantParameter paramAtom={paramAtom} className={defaultPadding} />;
      sweepCol = <DefaultEmptyParam />;
      break;

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
  const sectionName = 'input';
  const sectionAtom = getFocusedAtom(sectionName);
  const setSectionConfig = useSetAtom(sectionAtom);

  const addNew = () => {
    cloneLastAndAdd(setSectionConfig);
  };

  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      sectionName={sectionName}
      RowRenderer={InputBlock}
      isGroup
    >
      <GenericAddButton onClick={addNew} title="Add Sensory Input" />
    </GenericParamWrapper>
  );
}
