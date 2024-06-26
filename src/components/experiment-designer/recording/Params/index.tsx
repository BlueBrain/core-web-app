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
  ExpDesignerTargetParameter,
} from '@/types/experiment-designer';

import { getNewRecordingObj } from '@/components/experiment-designer/defaultNewObject';
import DocumentationIcon from '@/components/icons/Documentation';

function RecordingBlock({ paramAtom }: { paramAtom: Atom<ExpDesignerParam> }) {
  const param = useAtomValue<ExpDesignerParam>(paramAtom);
  const columnStyle = `${defaultColumnStyle} w-full`;

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

    case 'targetDropdown': {
      const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerTargetParameter>;
      constantCol = (
        <RecordingTargetSelector paramAtom={paramAtomTyped} className={defaultPadding} />
      );
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

const getDescription = () => (
  <div>
    <div>
      To get more information about recording options read Sonata documentation provided below:{' '}
    </div>
    <a
      href="https://sonata-extension.readthedocs.io/en/latest/sonata_simulation.html#reports"
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
    dispatch({ type: 'insert', value: getNewRecordingObj() });
  };

  const removeGroup = (groupAtom: PrimitiveAtom<ExpDesignerParam> | null) => {
    if (!groupAtom) return;
    dispatch({ type: 'remove', atom: groupAtom });
  };

  return (
    <GenericParamWrapper
      description={getDescription()}
      listAtoms={listAtoms}
      RowRenderer={RecordingBlock}
      showHeader={false}
      onRemoveGroup={removeGroup}
      isGroup
      namePrefix="recording"
    >
      <GenericAddButton onClick={addNew} title="Add Recording" />
    </GenericParamWrapper>
  );
}
