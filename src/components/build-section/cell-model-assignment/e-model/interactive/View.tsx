'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Button,
  ConfigProvider,
  Form,
  Drawer,
  InputNumber,
  theme,
  Space,
  Checkbox,
  Select,
  Collapse,
} from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';

import throttle from 'lodash/throttle';

import { PositionedPoptip } from './PositionedPopover';
import SimTracePlot from './SimTracePlot';
import { useEModelUUID, useEnsureModelPackage } from './hooks';
import BlueNaasCls from './blue-naas';
import { DEFAULT_SIM_CONFIG } from './constants';
import { PlotData, SimConfig, TraceData } from './types';
import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';

const baseBannerStyle =
  'flex h-full items-center justify-center text-4xl bg-gray-950 text-gray-100';

type BlueNaasProps = {
  modelId: string;
};

type SelectionCtrlConfig = {
  position: {
    x: number;
    y: number;
  };
  data: {
    segName: string;
  };
};

type SimConfigFormProps = {
  simConfig: SimConfig;
  onChange: (simConfig: SimConfig) => void;
  secNames: string[];
  segNames: string[];
  onSubmit: (simConfig: SimConfig) => void;
};

const simConfigFormLayout = {
  labelCol: { span: 8 },
  wrapperCol: { offset: 6, span: 10 },
};

function SimConfigForm({ simConfig, onChange, onSubmit, secNames, segNames }: SimConfigFormProps) {
  const [form] = Form.useForm<SimConfig>();

  const formSimConfig = Form.useWatch([], form);

  const [submittable, setSubmittable] = useState<boolean>(true);

  const [activePanels, setActivePanels] = useState<string[]>(['stimRecConfig', 'generalConfig']);

  const onStimulusLocationChange = (stimulusLocation: string) => {
    form.setFieldValue('injectTo', stimulusLocation);
  };

  const onRecordingLocationsChange = (recordingLocations: string[]) => {
    form.setFieldValue('recordFrom', recordingLocations);
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

  const onFinish = (submittedSimConf: SimConfig) => {
    setActivePanels(activePanels.filter((panelKey) => panelKey !== 'stimRecConfig'));

    onSubmit(submittedSimConf);
  };

  const stimulusConfigurationPanel = (
    <>
      <Form.Item
        name="injectTo"
        label="Current injection location"
        rules={[{ required: true }]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Select
          showSearch
          placeholder="Select stimulus location"
          onChange={onStimulusLocationChange}
          options={secNames.map((secName) => ({ value: secName, label: secName }))}
        />
      </Form.Item>

      <Form.Item name="delay" label="Delay" rules={[{ required: true }]}>
        <InputNumber addonAfter="ms" className="w-full" min={0} max={5000} />
      </Form.Item>

      <Form.Item name="dur" label="Duration" rules={[{ required: true }]}>
        <InputNumber addonAfter="ms" className="w-full" min={0} max={5000} />
      </Form.Item>

      <Form.Item name="amp" label="Amperage" rules={[{ required: true }]}>
        <InputNumber addonAfter="nA" className="w-full" min={-10} max={10} step={0.1} />
      </Form.Item>

      <Form.Item
        name="recordFrom"
        label="Recording locations"
        rules={[{ required: true }]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Select
          showSearch
          placeholder="Select recording locations"
          onChange={onRecordingLocationsChange}
          mode="multiple"
          options={segNames.map((secName) => ({ value: secName, label: secName }))}
        />
      </Form.Item>
    </>
  );

  const generalConfigPanel = (
    <>
      <Form.Item name="tstop" label="Time stop" rules={[{ required: true }]}>
        <InputNumber addonAfter="ms" className="w-full" min={0} max={5000} />
      </Form.Item>

      <Form.Item name="celsius" label="Temperature" rules={[{ required: true }]}>
        <InputNumber addonAfter="°C" className="w-full" min={20} max={40} />
      </Form.Item>

      <Form.Item
        className="mb-0"
        label="Time step"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        required
      >
        <Space>
          <Form.Item name="variableDt" valuePropName="checked" noStyle>
            <Checkbox className="mb-8">Variable</Checkbox>
          </Form.Item>
          <Form.Item name="dt" rules={[{ required: !formSimConfig?.variableDt }]}>
            <InputNumber disabled={formSimConfig?.variableDt} min={0.001} max={10} />
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item name="vinit" label="Initial voltage" rules={[{ required: true }]}>
        <InputNumber addonAfter="mV" className="w-full" min={-100} max={100} />
      </Form.Item>

      <Form.Item name="hypamp" label="Holding current" rules={[{ required: true }]}>
        <InputNumber addonAfter="nA" className="w-full" min={-10} max={10} />
      </Form.Item>
    </>
  );

  return (
    <Form
      labelCol={simConfigFormLayout.labelCol}
      wrapperCol={simConfigFormLayout.wrapperCol}
      labelAlign="left"
      form={form}
      name="simConfigForm"
      initialValues={simConfig}
      onValuesChange={(_, updatedSimConfig) => onChange(updatedSimConfig)}
      onFinish={onFinish}
      autoComplete="off"
      size="small"
    >
      <Collapse
        activeKey={activePanels}
        size="small"
        onChange={(keys) => setActivePanels(keys as string[])}
        items={[
          {
            key: 'stimRecConfig',
            label: 'Stimulus configuration',
            children: stimulusConfigurationPanel,
          },
          {
            key: 'generalConfig',
            label: 'Simulation configuration',
            children: generalConfigPanel,
          },
        ]}
      />

      <Form.Item noStyle>
        <Button className="mt-8" type="primary" htmlType="submit" block disabled={!submittable}>
          Start simulation
        </Button>
      </Form.Item>
    </Form>
  );
}

export function BlueNaas({ modelId }: BlueNaasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const blueNaasInstance = useRef<BlueNaasCls | null>(null);

  const [secNames, setSecNames] = useState<string[]>([]);
  const [segNames, setSegNames] = useState<string[]>([]);

  const [simConfig, setSimConfig] = useState({ ...DEFAULT_SIM_CONFIG });

  const [plotData, setPlotData] = useState<PlotData | null>(null);

  const [selectionCtrlConfig, setSelectionCtrlConfig] = useState<SelectionCtrlConfig | null>(null);

  const [simDrawerOpen, setSimDrawerOpen] = useState<boolean>(true);

  const setInjection = () => {
    if (!selectionCtrlConfig) {
      throw new Error('SelectionCtrlConfig is not undefined');
    }

    const secName = selectionCtrlConfig.data.segName.replace(/_.*/, '');

    setSimConfig({
      ...simConfig,
      injectTo: secName,
    });
  };

  const addRecording = () => {
    if (!selectionCtrlConfig) {
      throw new Error('SelectionCtrlConfig is not undefined');
    }

    setSimConfig({
      ...simConfig,
      recordFrom: [...simConfig.recordFrom, selectionCtrlConfig.data.segName],
    });
  };

  const runSim = () => {
    if (!blueNaasInstance.current) {
      throw new Error('No BlueNaaS instance');
    }

    blueNaasInstance.current.runSim();
  };

  useEffect(() => {
    if (!blueNaasInstance.current) return;

    blueNaasInstance.current.setConfig(simConfig);
  }, [simConfig]);

  useEffect(() => {
    if (!containerRef.current) return;

    const onClick = (data: any) => {
      setSelectionCtrlConfig({
        position: data.clickPosition,
        data: { segName: data.type },
      });
    };

    const onHoverEnd = () => {
      setSelectionCtrlConfig(null);
    };

    const onInit = (initData: any) => {
      setSecNames(initData.secNames);
      setSegNames(initData.segNames);
    };

    const onTraceData = throttle((data: TraceData) => {
      const updatedPlotData: PlotData = data.map((entry) => ({
        x: entry.t,
        y: entry.v,
        type: 'scatter',
        name: entry.segName,
      }));

      setPlotData(updatedPlotData);
    }, 100);

    blueNaasInstance.current = new BlueNaasCls(containerRef.current, modelId, DEFAULT_SIM_CONFIG, {
      onClick,
      onHoverEnd,
      onInit,
      onTraceData,
    });

    // eslint-disable-next-line consistent-return
    return () => {
      if (!blueNaasInstance.current) return;

      blueNaasInstance.current.destroy();
      blueNaasInstance.current = null;
    };
  }, [modelId]);

  return (
    <div className="relative h-full">
      <div className="h-full" ref={containerRef} />

      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            borderRadius: 0,
          },
        }}
      >
        <Button
          className="absolute top-8 right-8"
          type="default"
          icon={<MenuFoldOutlined />}
          onClick={() => setSimDrawerOpen(true)}
        />

        {selectionCtrlConfig && (
          <PositionedPoptip config={selectionCtrlConfig.position}>
            <Button
              onClick={setInjection}
              disabled={simConfig.injectTo === selectionCtrlConfig.data.segName.replace(/_.*/, '')}
            >
              Set Injection
            </Button>
            <Button
              onClick={addRecording}
              disabled={simConfig.recordFrom.includes(selectionCtrlConfig.data.segName)}
            >
              Add Recording
            </Button>
          </PositionedPoptip>
        )}

        <Drawer
          title="Simulate E-Model"
          placement="right"
          rootStyle={{ top: '90px' }}
          zIndex={20}
          open={simDrawerOpen}
          onClose={() => setSimDrawerOpen(false)}
          mask={false}
        >
          <SimConfigForm
            simConfig={simConfig}
            onChange={setSimConfig}
            onSubmit={runSim}
            secNames={secNames}
            segNames={segNames}
          />

          {plotData && <SimTracePlot className="mt-8" data={plotData} />}
        </Drawer>
      </ConfigProvider>
    </div>
  );
}

export default function EModelInteractiveView() {
  const selectedEModel = useAtomValue(selectedEModelAtom);

  const eModelUUID = useEModelUUID();
  const ensureModelPackage = useEnsureModelPackage();

  const [blueNaasModelId, setBlueNaasModelId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!eModelUUID || selectedEModel?.isOptimizationConfig) return;

    const init = async () => {
      setBlueNaasModelId(null);
      setLoading(true);

      await ensureModelPackage();

      setBlueNaasModelId(eModelUUID);
    };

    init();
  }, [eModelUUID, ensureModelPackage, selectedEModel?.isOptimizationConfig]);

  if (!blueNaasModelId) {
    const msg = loading ? 'Loading...' : 'Select a leaf region and an already built E-Model';

    return <div className={baseBannerStyle}>{msg}</div>;
  }

  return <BlueNaas modelId={blueNaasModelId} />;
}
