'use client';

import { PrimitiveAtom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import InputTargetSelector from './InputTargetSelector';
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
  MultiTargetDropdown,
  MultiDropdown,
} from '@/components/experiment-designer';
import type {
  ExpDesignerDropdownParameter,
  ExpDesignerMultipleDropdownParameter,
  ExpDesignerNumberParameter,
  ExpDesignerParam,
  ExpDesignerRangeParameter,
  ExpDesignerTargetDropdownGroupParameter,
  ExpDesignerTargetParameter,
} from '@/types/experiment-designer';
import { getNewSensoryInputObj } from '@/components/experiment-designer/defaultNewObject';
import { applySwapFunction } from '@/components/experiment-designer/utils';

function InputBlock({ paramAtom }: { paramAtom: PrimitiveAtom<ExpDesignerParam> }) {
  const [param, setParam] = useAtom(paramAtom);
  const columnStyle = `${defaultColumnStyle} w-1/2`;

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

    case 'targetDropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerTargetParameter>;
      constantCol = (
        <InputTargetSelector
          paramAtom={paramAtomTyped}
          className={defaultPadding}
          onChangeParamType={changed}
        />
      );
      sweepCol = <DefaultEmptyParam />;
      break;
    }

    case 'targetDropdownGroup': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerTargetDropdownGroupParameter>;
      constantCol = <DefaultEmptyParam />;
      sweepCol = (
        <MultiTargetDropdown
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
      <div className={columnStyle}>{constantCol}</div>
      <div className={columnStyle}>{sweepCol}</div>
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
      description="Configure the sensory inputs to neuron populations."
      listAtoms={listAtoms}
      RowRenderer={InputBlock}
      onRemoveGroup={removeGroup}
      isGroup
      namePrefix="input"
    >
      <GenericAddButton onClick={addNew} title="Add Sensory Input" />
    </GenericParamWrapper>
  );
}
