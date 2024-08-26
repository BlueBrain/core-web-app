'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Form } from 'antd';

import SimulationButton from '../molecules/SimulationButton';
import Recording from './Recording';
import ExperimentSetup from './ExperimentSetup';
import Results from './Results';
import Stimulation from './stimulation-protocol/Stimulation';
import SynapticInputs from './synaptic-input/SynapticInputs';

import { simulateStepTrackerAtom } from '@/state/simulate/single-neuron';
import { SimulationConfiguration } from '@/types/simulation/single-neuron';
import { SimulationStepTitle, SimulationType } from '@/types/simulation/common';
import { recordingSourceForSimulationAtom } from '@/state/simulate/categories/recording-source-for-simulation';
import { currentInjectionSimulationConfigAtom } from '@/state/simulate/categories/current-injection-simulation';
import { synaptomeSimulationConfigAtom } from '@/state/simulate/categories/synaptome-simulation-config';
import { simulationConditionsAtom } from '@/state/simulate/categories/simulation-conditions';

type Props = {
  vlabId: string;
  projectId: string;
  simResourceSelf: string;
  modelSelf: string;
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
  const stimulation = ['injectTo', 'stimulusType', 'stimulusProtocol', 'paramValues'];
  const synapticInputs = ['id', 'delay', 'duration', 'frequency', 'weightScalar'];
  const stepsHasErrors: Array<SimulationStepTitle> = [];
  errorFields.forEach((elt) => {
    const hasErrors = elt.errors.length > 0;
    const experimentalSetupErrors = elt.name.some((v) => conditions.includes(v));
    const recordingErrors = elt.name.some((v) => recoding.includes(v));
    const stimulationProtocolErros = elt.name.some((v) => stimulation.includes(v));
    const synapticInputsErros = elt.name.some((v) => synapticInputs.includes(v));
    if (hasErrors) {
      if (experimentalSetupErrors) stepsHasErrors.push('Experimental setup');
      if (synapticInputsErros) stepsHasErrors.push('Synaptic inputs');
      if (stimulationProtocolErros) stepsHasErrors.push('Stimulation protocol');
      if (recordingErrors) stepsHasErrors.push('Recording');
    }
  });

  return stepsHasErrors;
}

export default function ParameterView({
  vlabId,
  projectId,
  simResourceSelf,
  modelSelf,
  type,
}: Props) {
  const [form] = Form.useForm<SimulationConfiguration>();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const recordFromConfig = useAtomValue(recordingSourceForSimulationAtom);
  const currentInjectionConfig = useAtomValue(currentInjectionSimulationConfigAtom);
  const synaptomeConfig = useAtomValue(synaptomeSimulationConfigAtom);
  const conditionsConfig = useAtomValue(simulationConditionsAtom);

  const initialValues: SimulationConfiguration = useMemo(
    () => ({
      recordFrom: recordFromConfig,
      currentInjection: currentInjectionConfig,
      conditions: conditionsConfig,
      ...(type === 'synaptome-simulation' ? { synapses: synaptomeConfig ?? undefined } : {}),
    }),
    [currentInjectionConfig, recordFromConfig, synaptomeConfig, conditionsConfig, type]
  );

  const [{ steps, current: currentSimulationStep }, upadteSimulationStepsStatus] =
    useAtom(simulateStepTrackerAtom);

  const onValuesChange = async () => {
    try {
      await form.validateFields({ recursive: true });
    } catch (error) {
      const errorObject = error as { errorFields: Array<any> };
      const list = checkStepError(errorObject.errorFields);
      setDisableSubmit(errorObject.errorFields.length > 0);
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
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

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
          <div
            className={currentSimulationStep.title === 'Experimental setup' ? 'w-full' : 'hidden'}
          >
            <ExperimentSetup />
          </div>
          {type === 'synaptome-simulation' && (
            <div
              className={currentSimulationStep.title === 'Synaptic inputs' ? 'w-full' : 'hidden'}
            >
              <SynapticInputs />
            </div>
          )}
          <div
            className={currentSimulationStep.title === 'Stimulation protocol' ? 'w-full' : 'hidden'}
          >
            <Stimulation modelSelfUrl={modelSelf} />
          </div>
          <div className={currentSimulationStep.title === 'Recording' ? 'w-full' : 'hidden'}>
            <Recording />
          </div>
          <div className={currentSimulationStep.title === 'Results' ? 'w-full' : 'hidden'}>
            <Results />
          </div>
          <div className="fixed bottom-4 right-4 z-20 mt-auto">
            <SimulationButton
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
