'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';

import { Divider } from 'antd';
import InputTargetRegionSelector from './InputTargetRegionSelector';
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

function InputBlock({ row }: { row: ExpDesignerParam }) {
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
        <InputBlock row={row} key={data.id + row.id} />
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

function addNewInput(input: ExpDesignerListParam[]): ExpDesignerListParam[] {
  if (!input.length) return [];

  const lastItemClone = structuredClone(input).pop() as ExpDesignerListParam;
  lastItemClone.id = crypto.randomUUID();
  input.push(lastItemClone);
  return input;
}

const loadableExpDesignConfigAtom = loadable(asyncExpDesignerConfigAtom);

export default function Params() {
  const expDesignConfigLoadable = useAtomValue(loadableExpDesignConfigAtom);
  const setExpDesignConfigLoadable = useSetAtom(asyncExpDesignerConfigAtom);

  const input =
    expDesignConfigLoadable.state === 'hasData' ? expDesignConfigLoadable.data.input : [];

  const onAddInput = () => {
    setExpDesignConfigLoadable((prevConfig: ExpDesignerConfig): ExpDesignerConfig => {
      const onlyInput = prevConfig.input as ExpDesignerListParam[];
      const newInputs = addNewInput(onlyInput);
      return { ...prevConfig, input: newInputs };
    });
  };

  return (
    <GenericParamWrapper
      description="Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Gravida in fermentum et
      sollicitudin ac orci phasellus egestas tellus. Diam ut venenatis tellus in metus vulputate."
      paramList={input}
      RowRenderer={ParameterRenderRow}
    >
      <GenericAddButton onClick={onAddInput} title="Add Sensory Input" />
    </GenericParamWrapper>
  );
}
