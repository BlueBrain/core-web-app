'use client';

import { useEffect, useMemo, useState } from 'react';
import { ConfigProvider, Form } from 'antd';
import { useAtom, useAtomValue } from 'jotai';

import SingleNeuron from './SingleNeuron';
import Synaptome from './Synaptome';

import { GenericSingleNeuronSimulationConfigSteps } from '@/components/simulate/single-neuron/molecules/types';
import { CreateBaseSimulationConfig } from '@/components/simulate/single-neuron/processSteps';
import { defaultSteps, simulateStepTrackerAtom } from '@/state/simulate/single-neuron';
import { SimulationConfiguration } from '@/types/simulation/single-neuron';
import { SimulationStepTitle, SimulationType } from '@/types/simulation/common';
import { recordingSourceForSimulationAtom } from '@/state/simulate/categories/recording-source-for-simulation';
import { currentInjectionSimulationConfigAtom } from '@/state/simulate/categories/current-injection-simulation';
import { synaptomeSimulationConfigAtom } from '@/state/simulate/categories/synaptome-simulation-config';
import { simulationExperimentalSetupAtom } from '@/state/simulate/categories/simulation-conditions';

import ConfigStepHeader from '@/components/simulate/single-neuron/molecules/ConfigStepHeader';

type Props = {
  projectId: string;
  virtualLabId: string;
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

export default function SingleNeuronSimulationGenericContainer({
  virtualLabId,
  projectId,
  type,
}: Props) {
  const [configStep, setConfigStep] =
    useState<GenericSingleNeuronSimulationConfigSteps>('basic-config');
  const onConfigStep = (value: GenericSingleNeuronSimulationConfigSteps) => setConfigStep(value);

  const [form] = Form.useForm<SimulationConfiguration>();
  const [disableForm, setDisableSubmit] = useState(false);
  const recordFromConfig = useAtomValue(recordingSourceForSimulationAtom);
  const currentInjectionConfig = useAtomValue(currentInjectionSimulationConfigAtom);
  const synaptomeConfig = useAtomValue(synaptomeSimulationConfigAtom);
  const conditionsConfig = useAtomValue(simulationExperimentalSetupAtom);

  const initialValues: SimulationConfiguration = useMemo(
    () => ({
      recordFrom: recordFromConfig,
      currentInjection: currentInjectionConfig,
      conditions: conditionsConfig,
      ...(type === 'synaptome-simulation' ? { synapses: synaptomeConfig ?? undefined } : {}),
    }),
    [currentInjectionConfig, recordFromConfig, synaptomeConfig, conditionsConfig, type]
  );

  const [{ steps, current: currentSimulationStep }, updateSimulationStepsStatus] =
    useAtom(simulateStepTrackerAtom);

  const onValuesChange = async () => {
    try {
      await form.validateFields({ recursive: true });
    } catch (error) {
      const errorObject = error as { errorFields: Array<any> };
      if (errorObject.errorFields.length) {
        const list = checkStepError(errorObject.errorFields);
        setDisableSubmit(true);
        updateSimulationStepsStatus({
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
              status: s.status,
            };
          }),
        });
      } else {
        setDisableSubmit(false);
        updateSimulationStepsStatus({
          steps: defaultSteps,
          current: currentSimulationStep,
        });
      }
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden bg-white">
      <ConfigProvider theme={{ hashed: false, token: { borderRadius: 0 } }}>
        <Form
          form={form}
          name="simulation-configuration"
          autoComplete="off"
          layout="vertical"
          className="h-[calc(100%-55px)]"
          initialValues={{
            ...initialValues,
            name: undefined,
            desctipion: undefined,
          }}
          onValuesChange={onValuesChange}
          requiredMark={false}
        >
          {configStep !== 'basic-config' && <ConfigStepHeader {...{ configStep }} />}
          <CreateBaseSimulationConfig {...{ configStep, onConfigStep }} />
          {configStep === 'simulaton-config' && (
            <>
              {type === 'single-neuron-simulation' && (
                <SingleNeuron {...{ virtualLabId, projectId, disableForm }} />
              )}
              {type === 'synaptome-simulation' && (
                <Synaptome {...{ virtualLabId, projectId, disableForm }} />
              )}
            </>
          )}
        </Form>
      </ConfigProvider>
    </div>
  );
}
