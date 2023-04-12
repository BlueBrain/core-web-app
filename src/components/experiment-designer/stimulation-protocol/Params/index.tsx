'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { Divider } from 'antd';

import InputTargetRegionSelector from './StimulationTargetRegionSelector';
import GenericAddButton from '@/components/experiment-designer/GenericAddButton';
import { asyncExpDesignerConfigAtom } from '@/state/experiment-designer';
import GenericParamWrapper, {
  defaultPadding,
  defaultColumnStyle,
} from '@/components/experiment-designer/GenericParamWrapper';
import {
  ConstantParameter,
  DropdownParameter,
  DefaultEmptyParam,
} from '@/components/experiment-designer';
import type {
  ExpDesignerListParam,
  ExpDesignerParam,
  ExpDesignerConfig,
} from '@/types/experiment-designer';

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

function ParameterRenderRow({ data }: { data: ExpDesignerListParam }) {
  return (
    <>
      {data.value.map((row) => (
        <StimulationBlock row={row} key={data.id + row.id} />
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

function addNewStimulus(stimuli: ExpDesignerListParam[]): ExpDesignerListParam[] {
  if (!stimuli.length) return [];

  const lastItemClone = structuredClone(stimuli.slice(-1)[0]) as ExpDesignerListParam;
  lastItemClone.id = crypto.randomUUID();
  stimuli.push(lastItemClone);
  return stimuli;
}

const loadableExpDesignConfigAtom = loadable(asyncExpDesignerConfigAtom);

export default function Params() {
  const expDesignConfigLoadable = useAtomValue(loadableExpDesignConfigAtom);
  const setExpDesignConfigLoadable = useSetAtom(asyncExpDesignerConfigAtom);

  const stimuli =
    expDesignConfigLoadable.state === 'hasData' ? expDesignConfigLoadable.data.stimuli : [];

  const onAddInput = () => {
    setExpDesignConfigLoadable((prevConfig: ExpDesignerConfig): ExpDesignerConfig => {
      const onlyStimuli = prevConfig.input as ExpDesignerListParam[];
      const newStimuli = addNewStimulus(onlyStimuli);
      return { ...prevConfig, stimuli: newStimuli };
    });
  };

  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      paramList={stimuli}
      RowRenderer={ParameterRenderRow}
    >
      <GenericAddButton onClick={onAddInput} title="Add Stimulation Protocol" />
    </GenericParamWrapper>
  );
}
