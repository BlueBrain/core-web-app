'use client';

import { Atom, useAtom, useSetAtom } from 'jotai';
import { Divider } from 'antd';

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
import type { ExpDesignerGroupParameter, ExpDesignerParam } from '@/types/experiment-designer';
import { getFocusedAtom, cloneLastAndAdd } from '@/components/experiment-designer/utils';

function StimulationBlock({ row }: { row: ExpDesignerParam }) {
  let constantCol;
  let sweepCol;
  switch (row.type) {
    case 'number':
      constantCol = <ConstantParameter data={row} className={defaultPadding} />;
      sweepCol = <DefaultEmptyParam />;
      break;

    case 'dropdown':
      constantCol = <DropdownParameter data={row} className={defaultPadding} />;
      sweepCol = <DefaultEmptyParam />;
      break;

    case 'regionDropdown':
      constantCol = <InputTargetRegionSelector data={row} className={defaultPadding} />;
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

function ParameterRenderRow({ paramAtom }: { paramAtom: any }) {
  const paramAtomParsed = paramAtom as Atom<ExpDesignerGroupParameter>;
  const [param] = useAtom<ExpDesignerGroupParameter>(paramAtomParsed);

  return (
    <>
      {param.value.map((row) => (
        <StimulationBlock row={row} key={param.id + row.id} />
      ))}
      <tr>
        <td>
          <Divider />
        </td>
        <td>
          <Divider />
        </td>
      </tr>
    </>
  );
}

export default function Params() {
  const sectionName = 'stimuli';
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
      RowRenderer={ParameterRenderRow}
    >
      <GenericAddButton onClick={addNew} title="Add Stimulation Protocol" />
    </GenericParamWrapper>
  );
}
