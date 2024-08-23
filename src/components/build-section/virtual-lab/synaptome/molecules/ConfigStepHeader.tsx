import { useReducer } from 'react';
import { Form } from 'antd';
import { CaretRightOutlined, DownOutlined } from '@ant-design/icons';

import BasicConfigurationHeader from './BasicConfigurationHeader';

import { SynaptomeModelConfigSteps } from './types';
import { SynaptomeModelConfiguration } from '@/types/synaptome';
import { classNames } from '@/util/utils';

type Props = {
  configStep: SynaptomeModelConfigSteps;
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
          <div>{name}</div>
          <CaretRightOutlined />
        </div>
        <div
          className={classNames(
            'flex w-fit items-center gap-2 uppercase tracking-wide',
            configStep === 'me-model-config' ? 'flex text-primary-8' : 'text-neutral-4',
            configStep === 'basic-config' && 'hidden'
          )}
        >
          <div>select single neuron</div>
          {configStep === 'me-model-config' ? (
            <DownOutlined onClick={onToggleBasicConfig} />
          ) : (
            <CaretRightOutlined />
          )}
        </div>

        <div
          className={classNames(
            'flex w-fit items-center gap-2 uppercase tracking-wide',
            configStep === 'placement-config' ? 'flex text-primary-8' : 'hidden text-neutral-4'
          )}
        >
          <div>configure model</div>
          {configStep === 'placement-config' ? (
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
