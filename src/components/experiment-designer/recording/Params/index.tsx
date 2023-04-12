'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { Divider } from 'antd';

import RecordingTargetRegionSelector from './RecordingTargetRegionSelector';
import GenericAddButton from '@/components/experiment-designer/GenericAddButton';
import { asyncExpDesignerConfigAtom } from '@/state/experiment-designer';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import { ConstantParameter, DropdownParameter } from '@/components/experiment-designer';
import type {
  ExpDesignerListParam,
  ExpDesignerParam,
  ExpDesignerConfig,
} from '@/types/experiment-designer';

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

function ParameterRenderRow({ data }: { data: ExpDesignerListParam }) {
  return (
    <>
      {data.value.map((row) => (
        <RecordingBlock row={row} key={data.id + row.id} />
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

function addNewRecording(input: ExpDesignerListParam[]): ExpDesignerListParam[] {
  if (!input.length) return [];

  const lastItemClone = structuredClone(input).pop() as ExpDesignerListParam;
  lastItemClone.id = crypto.randomUUID();
  input.push(lastItemClone);
  return input;
}

const loadableExpDesignConfigAtom = loadable(asyncExpDesignerConfigAtom);

export default function Params() {
  const expDesignConfigLoadable = useAtomValue(loadableExpDesignConfigAtom);
  const setExpDesignConfig = useSetAtom(asyncExpDesignerConfigAtom);

  const recording =
    expDesignConfigLoadable.state === 'hasData' ? expDesignConfigLoadable.data.recording : [];

  const onAddInput = () => {
    setExpDesignConfig((prevConfig: ExpDesignerConfig): ExpDesignerConfig => {
      const onlyRecording = prevConfig.recording as ExpDesignerListParam[];
      const newRecordings = addNewRecording(onlyRecording);
      return { ...prevConfig, recording: newRecordings };
    });
  };

  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      paramList={recording}
      RowRenderer={ParameterRenderRow}
      showHeader={false}
    >
      <GenericAddButton onClick={onAddInput} title="Add Recording" />
    </GenericParamWrapper>
  );
}
