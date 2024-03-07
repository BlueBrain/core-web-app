'use client';

import { useAtom, useAtomValue } from 'jotai';
import { Form } from 'antd';
import { useState, useEffect } from 'react';

import Stimulation from './Stimulation';
import Recording from './Recording';
import Conditions from './Conditions';
import Analysis from './Analysis';
import Visualization from './Visualization';
import { simulateStepAtom, simulationConfigAtom } from '@/state/simulate/single-neuron';
import { SimAction, SimConfig } from '@/types/simulate/single-neuron';
import GenericButton from '@/components/Global/GenericButton';

export default function ParameterView() {
  const [simConfig, dispatch] = useAtom(simulationConfigAtom);
  const [form] = Form.useForm<SimConfig>();
  const formSimConfig = Form.useWatch([], form);
  const simulateStep = useAtomValue(simulateStepAtom);
  const [submittable, setSubmittable] = useState<boolean>(true);

  const onChange = (action: SimAction) => {
    dispatch(action);
  };

  useEffect(() => {
    form.validateFields().then(
      () => setSubmittable(true),
      (validationResult) => setSubmittable(!validationResult.errorFields.length)
    );
  }, [formSimConfig, form]);

  useEffect(() => {
    form.setFieldsValue(simConfig);
  }, [form, simConfig]);

  const onFinish = () => {};

  return (
    <div className="w-full px-8 py-6">
      <div className="text-3xl font-bold capitalize text-primary-8">{simulateStep}</div>
      <Form
        form={form}
        name="simConfigForm"
        initialValues={simConfig}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <div className="mt-10 text-center text-2xl">
          <div className={simulateStep === 'stimulation' ? '' : 'hidden'}>
            <Stimulation onChange={onChange} simConfig={simConfig} />
          </div>
          <div className={simulateStep === 'recording' ? '' : 'hidden'}>
            <Recording onChange={onChange} />
          </div>
          <div className={simulateStep === 'conditions' ? '' : 'hidden'}>
            <Conditions onChange={onChange} />
          </div>
          <div className={simulateStep === 'analysis' ? '' : 'hidden'}>
            <Analysis />
          </div>
          <div className={simulateStep === 'visualization' ? '' : 'hidden'}>
            <Visualization />
          </div>
        </div>

        <Form.Item noStyle>
          <GenericButton
            text="Simulate"
            className="w-15 absolute bottom-5 right-5 mt-8 bg-primary-8 text-white"
            disabled={!submittable}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
