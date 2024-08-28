import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { z } from 'zod';

import { label } from '../molecules/Label';
import { SynaptomeModelConfigSteps } from '../molecules/types';
import { useSessionAtomValue } from '@/hooks/hooks';
import { selectorFnDate } from '@/util/explore-section/listing-selectors';
import { classNames } from '@/util/utils';

type Props = {
  configStep: SynaptomeModelConfigSteps;
  onConfigStep: (value: SynaptomeModelConfigSteps) => void;
};

const configStepValidationSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
});

export default function CreateBaseSynaptome({ configStep, onConfigStep }: Props) {
  const session = useSessionAtomValue();
  const { getFieldsValue, validateFields } = Form.useFormInstance();

  const proceed = async () => {
    await validateFields(['name', 'description']);
    if (configStepValidationSchema.safeParse(getFieldsValue(['name', 'description'])).success) {
      onConfigStep('me-model-config');
    }
  };

  return (
    <div
      className={classNames(
        'flex w-full flex-col items-start gap-14 p-10',
        configStep !== 'basic-config' ? 'hidden' : 'h-[calc(100vh-51px)]'
      )}
    >
      <h1 className="text-3xl font-bold text-primary-8">Build new single cell model</h1>
      <div className="flex w-full flex-col">
        <div className="grid max-h-[50%] w-full grid-cols-2 gap-14">
          <Form.Item
            name="name"
            label={label('name')}
            rules={[{ required: true, message: 'Please provide a name!' }]}
            validateTrigger="onBlur"
          >
            <Input
              placeholder="Your model name"
              size="large"
              className="rounded-none border-0 !border-b-[1.5px]  !border-primary-8 !font-bold !text-primary-8"
            />
          </Form.Item>
        </div>
        <div className="grid max-h-[50%] w-full grid-cols-2 gap-14">
          <Form.Item name="description" label={label('Description')}>
            <Input.TextArea
              rows={5}
              placeholder="Your description"
              size="large"
              className="rounded-none border border-gray-400 p-2"
            />
          </Form.Item>
          <div className="grid grid-cols-2 items-start justify-between gap-2">
            <div className="flex flex-col items-start gap-1">
              {label('contributors', 'secondary')}
              <div className="flex items-center justify-center gap-2 text-primary-8">
                <UserOutlined className="h-3 w-3" />
                {session?.user.name}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {label('creation date', 'secondary')}
              <div className="text-primary-8">{selectorFnDate(new Date().toISOString())}</div>
            </div>
          </div>
        </div>
      </div>
      <Button
        htmlType="button"
        type="primary"
        size="large"
        className="fixed bottom-10 right-10 rounded-none bg-primary-8 text-white"
        onClick={proceed}
      >
        Start building
      </Button>
    </div>
  );
}
