'use client';

import { PrimitiveAtom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { splitAtom } from 'jotai/utils';

import InputTargetSelector from './StimulationTargetSelector';
import GenericAddButton from '@/components/experiment-designer/GenericAddButton';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import {
  ConstantParameter,
  DropdownParameter,
  DefaultEmptyParam,
  MultiTargetDropdown,
  MultiDropdown,
  RangeParameter,
} from '@/components/experiment-designer';
import type {
  ExpDesignerParam,
  ExpDesignerNumberParameter,
  ExpDesignerTargetParameter,
  ExpDesignerDropdownParameter,
  ExpDesignerTargetDropdownGroupParameter,
  ExpDesignerMultipleDropdownParameter,
  ExpDesignerRangeParameter,
} from '@/types/experiment-designer';
import { getNewStimulusObj } from '@/components/experiment-designer/defaultNewObject';
import { applySwapFunction } from '@/components/experiment-designer/utils';
import DocumentationIcon from '@/components/icons/Documentation';

function StimulationBlock({ paramAtom }: { paramAtom: PrimitiveAtom<ExpDesignerParam> }) {
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

const getDescription = () => (
  <div>
    <div>
      To get more information about stimulation protocols options read Sonata documentation provided
      below:{' '}
    </div>
    <a
      href="https://sonata-extension.readthedocs.io/en/latest/sonata_simulation.html#inputs"
      target="_blank"
      rel="noreferrer"
    >
      <button
        type="button"
        className="mt-2 flex items-center gap-2 bg-neutral-1 p-2 text-primary-8"
      >
        <DocumentationIcon />A guide to Sonata
      </button>
    </a>
  </div>
);

export default function Params({ focusedAtom }: Props) {
  const atoms = useMemo(() => splitAtom(focusedAtom), [focusedAtom]);
  const [listAtoms, dispatch] = useAtom(atoms);

  const addNew = () => {
    dispatch({ type: 'insert', value: getNewStimulusObj() });
  };

  const removeGroup = (groupAtom: PrimitiveAtom<ExpDesignerParam> | null) => {
    if (!groupAtom) return;
    dispatch({ type: 'remove', atom: groupAtom });
  };

  return (
    <GenericParamWrapper
      description={getDescription()}
      listAtoms={listAtoms}
      RowRenderer={StimulationBlock}
      onRemoveGroup={removeGroup}
      isGroup
      namePrefix="stimulus"
    >
      <GenericAddButton onClick={addNew} title="Add Stimulation Protocol" />
    </GenericParamWrapper>
  );
}
