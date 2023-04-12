'use client';

import { Atom, useAtom, useSetAtom } from 'jotai';

import RecordingTargetRegionSelector from './RecordingTargetRegionSelector';
import GenericAddButton from '@/components/experiment-designer/GenericAddButton';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import { ConstantParameter, DropdownParameter } from '@/components/experiment-designer';
import type { ExpDesignerGroupParameter, ExpDesignerParam } from '@/types/experiment-designer';
import { getFocusedAtom, cloneLastAndAdd } from '@/components/experiment-designer/utils';

function RecordingBlock({ row }: { row: ExpDesignerParam }) {
  let constantCol;
  switch (row.type) {
    case 'number':
      constantCol = (
        <ConstantParameter data={row} className={defaultPadding} showSwitcher={false} />
      );
      break;

    case 'dropdown':
      constantCol = (
        <DropdownParameter data={row} className={defaultPadding} showSwitcher={false} />
      );
      break;

    case 'regionDropdown':
      constantCol = <RecordingTargetRegionSelector data={row} className={defaultPadding} />;
      break;

    default:
      break;
  }

  return (
    <tr>
      <td className={defaultColumnStyle}>{constantCol}</td>
    </tr>
  );
}

export default function Params() {
  const sectionName = 'recording';
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
      RowRenderer={RecordingBlock}
      showHeader={false}
      isGroup
    >
      <GenericAddButton onClick={addNew} title="Add Recording" />
    </GenericParamWrapper>
  );
}
