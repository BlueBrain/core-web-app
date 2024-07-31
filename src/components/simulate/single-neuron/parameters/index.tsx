'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Form } from 'antd';
import { useEffect, useMemo } from 'react';

import Stimulation from './Stimulation';
import Recording from './Recording';
import Conditions from './Conditions';
import Analysis from './Analysis';
import Visualization from './Visualization';
import Results from './Results';
import ModelWithSynapseConfig from './ModelWithSynapseConfig';
import {
  simulateStepAtom,
  simulationConfigAtom,
  simulationFormIsFilledAtom,
} from '@/state/simulate/single-neuron';
import {
  SimAction,
  SimConfig,
  ModelResource,
  isSingleModelSimConfig,
  isSynaptomModel,
} from '@/types/simulate/single-neuron';
import { getDefaultSynapsesConfig } from '@/constants/simulate/single-neuron';

type Props = {
  resource: ModelResource;
};

export default function ParameterView({ resource }: Props) {
  const [simConfig, dispatch] = useAtom(simulationConfigAtom);
  const [form] = Form.useForm<SimConfig>();
  const formSimConfig = Form.useWatch([], form);
  const simulateStep = useAtomValue(simulateStepAtom);
  const setSubmittable = useSetAtom(simulationFormIsFilledAtom);

  const onChange = (action: SimAction) => {
    dispatch(action);
  };

  useEffect(() => {
    form.validateFields().then(
      () => setSubmittable(true),
      (validationResult) => setSubmittable(!validationResult.errorFields.length)
    );
  }, [formSimConfig, form, setSubmittable]);

  useEffect(() => {
    form.setFieldsValue({
      ...simConfig,
      directStimulation: simConfig.directStimulation ?? undefined,
      synapses: simConfig.synapses ?? undefined,
    });
  }, [form, simConfig]);

  const defaultSynapsesConfig = useMemo(() => {
    if (isSynaptomModel(resource)) {
      return getDefaultSynapsesConfig(resource)!;
    }
    return null;
  }, [resource]);

  useEffect(() => {
    if (defaultSynapsesConfig) {
      dispatch({ type: 'SET_STIMULUS_AND_SYNAPSES', payload: defaultSynapsesConfig });
    }
  }, [defaultSynapsesConfig, dispatch]);

  const onFinish = () => {};
  return (
    <div className="h-full w-full overflow-y-scroll px-8 py-6">
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
            {isSynaptomModel(resource) ? (
              <ModelWithSynapseConfig
                onChange={onChange}
                simConfig={simConfig}
                defaultSynapsesConfig={defaultSynapsesConfig!}
                synapses={resource.synapses.map((s) => s.id)}
                modelSelfUrl={resource._self}
              />
            ) : (
              isSingleModelSimConfig(simConfig) && (
                <Stimulation
                  onChange={onChange}
                  simConfig={simConfig}
                  modelSelfUrl={resource._self}
                />
              )
            )}
          </div>
          <div className={simulateStep === 'recording' ? '' : 'hidden'}>
            <Recording onChange={onChange} />
          </div>
          <div className={simulateStep === 'conditions' ? '' : 'hidden'}>
            <Conditions onChange={onChange} stimulationId={0} />
          </div>
          <div className={simulateStep === 'analysis' ? '' : 'hidden'}>
            <Analysis />
          </div>
          <div className={simulateStep === 'visualization' ? '' : 'hidden'}>
            <Visualization />
          </div>
          <div className={simulateStep === 'results' ? '' : 'hidden'}>
            <Results />
          </div>
        </div>
      </Form>
    </div>
  );
}
