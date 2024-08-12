'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useAtom } from 'jotai';
import { Form } from 'antd';

import Recording from './Recording';
import Conditions from './Conditions';
import Analysis from './Analysis';
import Visualization from './Visualization';
import Results from './Results';
import LaunchButton from './LaunchButton';

import { simulateStepTrackerAtom } from '@/state/simulate/single-neuron';
import { SimulationConfiguration } from '@/types/simulation/single-neuron';
import { SimulationStepTitle, SimulationType } from '@/types/simulation/common';

type Props = {
  vlabId: string;
  projectId: string;
  simResourceSelf: string;
  initialValues: SimulationConfiguration;
  children: ReactNode;
  type: SimulationType;
};

type ErrorField = {
  name: Array<string>;
  errors: Array<string>;
  warning: Array<string>;
};

function checkStepError(errorFields: Array<ErrorField>): Array<SimulationStepTitle> {
  const conditions = ['celsius', 'vinit', 'hypamp'];
  const recoding = ['recordFrom'];
  const stimulation = [
    'injectTo',
    'stimulusType',
    'stimulusProtocol',
    'paramValues',
    'synapseId',
    'delay',
    'duration',
    'frequency',
    'weightScalar',
  ];
  const stepsHasErrors: Array<SimulationStepTitle> = [];
  errorFields.forEach((elt) => {
    const hasErrors = elt.errors.length > 0;
    const conditionsErrors = elt.name.some((v) => conditions.includes(v));
    const recordingErrors = elt.name.some((v) => recoding.includes(v));
    const stimulationErros = elt.name.some((v) => stimulation.includes(v));
    if (hasErrors) {
      if (conditionsErrors) stepsHasErrors.push('conditions');
      if (recordingErrors) stepsHasErrors.push('recording');
      if (stimulationErros) stepsHasErrors.push('stimulation');
    }
  });

  return stepsHasErrors;
}

export default function ParameterView({
  vlabId,
  projectId,
  simResourceSelf,
  initialValues,
  type,
  children,
}: Props) {
  const [form] = Form.useForm<SimulationConfiguration>();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [{ steps, current: currentSimulationStep }, upadteSimulationStepsStatus] =
    useAtom(simulateStepTrackerAtom);

  const onValuesChange = async () => {
    try {
      await form.validateFields({ recursive: true });
    } catch (error) {
      const errorObject = error as { errorFields: Array<any> };
      setDisableSubmit(errorObject.errorFields.length > 0);
      const list = checkStepError(errorObject.errorFields);
      upadteSimulationStepsStatus({
        current: currentSimulationStep,
        steps: steps.map((s) => {
          if (list.includes(s.title)) {
            return {
              title: s.title,
              status: 'error',
            };
          }
          return {
            title: s.title,
            status: undefined,
          };
        }),
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      recordFrom: initialValues.recordFrom,
      directStimulation: initialValues.directStimulation ?? undefined,
      ...(type === 'synaptome-simulation' ? { synapses: initialValues.synapses ?? undefined } : {}),
    });
  }, [form, initialValues, type]);

  return (
    <div className="relative h-full w-full px-8 py-6">
      <div className="my-5 text-3xl font-bold capitalize text-primary-8">
        {currentSimulationStep.title}
      </div>
      <Form
        form={form}
        name="simConfigForm"
        autoComplete="off"
        layout="vertical"
        className="h-[calc(100%-55px)]"
        initialValues={initialValues}
        onValuesChange={onValuesChange}
      >
        <div className="flex h-full w-full flex-col items-center text-center text-2xl">
          <div className={currentSimulationStep.title === 'stimulation' ? 'w-full' : 'hidden'}>
            {children}
          </div>
          <div className={currentSimulationStep.title === 'recording' ? 'w-full' : 'hidden'}>
            <Recording />
          </div>
          <div className={currentSimulationStep.title === 'conditions' ? 'w-full' : 'hidden'}>
            <Conditions stimulationId={0} />
          </div>
          <div className={currentSimulationStep.title === 'analysis' ? 'w-full' : 'hidden'}>
            <Analysis />
          </div>
          <div className={currentSimulationStep.title === 'visualization' ? 'w-full' : 'hidden'}>
            <Visualization />
          </div>
          <div className={currentSimulationStep.title === 'results' ? 'w-full' : 'hidden'}>
            <Results />
          </div>
          <div className="fixed bottom-4 right-8 mt-auto">
            <LaunchButton
              modelSelfUrl={simResourceSelf}
              vLabId={vlabId}
              projectId={projectId}
              simulationType={type}
              disabled={disableSubmit}
            />
          </div>
        </div>
      </Form>
    </div>
  );
}
