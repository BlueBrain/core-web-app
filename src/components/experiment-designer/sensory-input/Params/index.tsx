'use client';

import { PrimitiveAtom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

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
  RangeParameter,
  MultiBrainRegionDropdown,
  MultiDropdown,
} from '@/components/experiment-designer';
import type {
  ExpDesignerDropdownParameter,
  ExpDesignerMultipleDropdownParameter,
  ExpDesignerNumberParameter,
  ExpDesignerParam,
  ExpDesignerRangeParameter,
  ExpDesignerRegionDropdownGroupParameter,
  ExpDesignerRegionParameter,
} from '@/types/experiment-designer';
import { getNewSensoryInputObj } from '@/components/experiment-designer/defaultNewObject';
import { applySwapFunction } from '@/components/experiment-designer/utils';

function InputBlock({ paramAtom }: { paramAtom: PrimitiveAtom<ExpDesignerParam> }) {
  const [param, setParam] = useAtom(paramAtom);

  const changed = () => {
    const newSwapParam = applySwapFunction(param);
    if (!newSwapParam) return;

    setParam(newSwapParam);
  };

  let constantCol;
  let sweepCol;
  switch (param.type) {
    case 'number': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerNumberParameter>;
      constantCol = (
        <ConstantParameter
          paramAtom={paramAtomTyped}
          className={defaultPadding}
          onChangeParamType={changed}
        />
      );
      sweepCol = <DefaultEmptyParam />;
      break;
    }

    case 'range': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerRangeParameter>;
      constantCol = <DefaultEmptyParam />;
      sweepCol = <RangeParameter paramAtom={paramAtomTyped} onChangeParamType={changed} />;
      break;
    }

    case 'dropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerDropdownParameter>;
      constantCol = (
        <DropdownParameter
          paramAtom={paramAtomTyped}
          className={defaultPadding}
          onChangeParamType={changed}
        />
      );
      sweepCol = <DefaultEmptyParam />;
      break;
    }

    case 'multipleDropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerMultipleDropdownParameter>;
      constantCol = <DefaultEmptyParam />;
      sweepCol = (
        <MultiDropdown
          paramAtom={paramAtomTyped}
          className={defaultPadding}
          onChangeParamType={changed}
        />
      );

      break;
    }

    case 'regionDropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerRegionParameter>;
      constantCol = (
        <InputTargetRegionSelector
          paramAtom={paramAtomTyped}
          className={defaultPadding}
          onChangeParamType={changed}
        />
      );
      sweepCol = <DefaultEmptyParam />;
      break;
    }

    case 'regionDropdownGroup': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerRegionDropdownGroupParameter>;
      constantCol = <DefaultEmptyParam />;
      sweepCol = (
        <MultiBrainRegionDropdown
          paramAtom={paramAtomTyped}
          className={defaultPadding}
          onChangeParamType={changed}
        />
      );
      break;
    }

    default:
      break;
  }

  return (
    <div className="flex">
      <div className={defaultColumnStyle}>{constantCol}</div>
      <div className={defaultColumnStyle}>{sweepCol}</div>
    </div>
  );
}

type Props = {
  focusedAtom: PrimitiveAtom<ExpDesignerParam[]>;
};

export default function Params({ focusedAtom }: Props) {
  const atoms = useMemo(() => splitAtom(focusedAtom), [focusedAtom]);
  const [listAtoms, dispatch] = useAtom(atoms);

  const addNew = () => {
    dispatch({ type: 'insert', value: getNewSensoryInputObj() });
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
      RowRenderer={InputBlock}
      onRemoveGroup={removeGroup}
      isGroup
    >
      <GenericAddButton onClick={addNew} title="Add Sensory Input" />
    </GenericParamWrapper>
  );
}
