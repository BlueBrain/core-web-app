import { useReducer } from 'react';
import { Form } from 'antd';
import { CaretRightOutlined, DownOutlined } from '@ant-design/icons';

import { GenericSingleNeuronSimulationConfigSteps } from './types';
import BasicConfigurationHeader from './BasicConfigurationHeader';

import { SynaptomeModelConfiguration } from '@/types/synaptome';
import { classNames } from '@/util/utils';

type Props = {
  configStep: GenericSingleNeuronSimulationConfigSteps;
};

export default function ConfigStepHeader({ configStep }: Props) {
  const { getFieldValue } = Form.useFormInstance<SynaptomeModelConfiguration>();
  const [openBasicConfig, onToggleBasicConfig] = useReducer((val) => !val, false);
  const name = getFieldValue('name');

  return (
    <div className="sticky left-0 top-0 w-full">
      <div
        className={classNames(
          'flex w-full items-center gap-4 px-10 py-4',
          !openBasicConfig && 'border-b border-neutral-2 '
        )}
      >
        <div className="flex w-fit items-center gap-2 uppercase tracking-wide text-gray-400">
          <div>Experiment</div>
          <CaretRightOutlined />
        </div>
        <div
          className={classNames(
            'flex w-fit items-center gap-2 uppercase tracking-wide',
            configStep === 'simulaton-config' ? 'flex text-primary-8' : 'hidden text-neutral-4'
          )}
        >
          <div className="font-bold">{name}</div>
          {configStep === 'simulaton-config' ? (
            <DownOutlined onClick={onToggleBasicConfig} />
          ) : (
            <CaretRightOutlined />
          )}
        </div>
      </div>
      {openBasicConfig && <BasicConfigurationHeader />}
    </div>
  );
}
