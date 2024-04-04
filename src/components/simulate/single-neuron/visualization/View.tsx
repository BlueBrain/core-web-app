'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from 'antd';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import throttle from 'lodash/throttle';

import { PositionedPopover } from './PositionedPopover';
import TraceLoader from './TraceLoader';
import { useEModelUUID, useEnsureModelPackage } from '@/services/bluenaas-single-cell/hooks';
import BlueNaasCls from '@/services/bluenaas-single-cell/blue-naas';
import { DEFAULT_SIM_CONFIG } from '@/constants/simulate/single-neuron';
import { SimAction } from '@/types/simulate/single-neuron';
import { PlotData, TraceData } from '@/services/bluenaas-single-cell/types';
import {
  eModelScriptAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import {
  blueNaasInstanceRefAtom,
  plotDataAtom,
  secNamesAtom,
  segNamesAtom,
  simulateStepAtom,
  simulationConfigAtom,
} from '@/state/simulate/single-neuron';
import { simulationDoneAtom } from '@/state/simulate/single-neuron-setter';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';

const baseBannerStyle =
  'flex h-full items-center justify-center text-4xl bg-gray-950 text-gray-100';

type BlueNaasProps = {
  modelId: string;
  // blueNaasInstance: unknown;
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

export function BlueNaas({ modelId }: BlueNaasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [simConfig, dispatch] = useAtom(simulationConfigAtom);
  const setBlueNaasInstanceRef = useSetAtom(blueNaasInstanceRefAtom);
  const simulationDoneCB = useSetAtom(simulationDoneAtom);
  const setSimulateStep = useSetAtom(simulateStepAtom);

  const blueNaasInstance = useRef<BlueNaasCls | null>(null);

  const [secNames, setSecNames] = useAtom(secNamesAtom);
  const setSegNames = useSetAtom(segNamesAtom);
  const setPlotData = useSetAtom(plotDataAtom);

  // this atom contains the threshold and holding values to initialize the model properly
  const eModelScript = useAtomValue(eModelScriptAtom);

  const [selectionCtrlConfig, setSelectionCtrlConfig] = useState<SelectionCtrlConfig | null>(null);

  const onChange = (action: SimAction) => {
    dispatch(action);
  };

  const setInjection = () => {
    if (!selectionCtrlConfig) {
      throw new Error('SelectionCtrlConfig is not undefined');
    }

    const secName = selectionCtrlConfig.data.segName.replace(/_.*/, '');
    onChange({ type: 'CHANGE_PARAM', payload: { key: 'injectTo', value: secName } });
  };

  const addRecording = () => {
    if (!selectionCtrlConfig) {
      throw new Error('SelectionCtrlConfig is not undefined');
    }

    const recordFrom = [...simConfig.recordFrom, selectionCtrlConfig.data.segName];
    onChange({ type: 'CHANGE_PARAM', payload: { key: 'recordFrom', value: recordFrom } });
  };

  useEffect(() => {
    if (!blueNaasInstance.current) return;

    blueNaasInstance.current.setConfig(simConfig);
  }, [simConfig]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!eModelScript?.holding_current || !eModelScript.threshold_current) return;

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

      if (!initData.secNames.includes(DEFAULT_SIM_CONFIG.injectTo)) {
        throw new Error('No soma section present');
      }
      if (!initData.segNames.includes(DEFAULT_SIM_CONFIG.recordFrom[0])) {
        throw new Error('No soma segment present');
      }

      setBlueNaasInstanceRef(blueNaasInstance);
    };

    const onTraceData = throttle((data: TraceData) => {
      setSimulateStep('results');
      const updatedPlotData: PlotData = data.map((entry) => ({
        x: entry.t,
        y: entry.v,
        type: 'scatter',
        name: entry.segName,
      }));
      setPlotData(updatedPlotData);
    }, 100);

    blueNaasInstance.current = new BlueNaasCls(
      containerRef.current,
      modelId,
      DEFAULT_SIM_CONFIG,
      {
        thresholdCurrent: eModelScript.threshold_current,
        holdingCurrent: eModelScript.holding_current,
      },
      {
        onClick,
        onHoverEnd,
        onInit,
        onTraceData,
        onSimulationDone: simulationDoneCB,
      }
    );

    // eslint-disable-next-line consistent-return
    return () => {
      if (!blueNaasInstance.current) return;

      blueNaasInstance.current.destroy();
      blueNaasInstance.current = null;
    };
  }, [
    modelId,
    setBlueNaasInstanceRef,
    setSecNames,
    setSegNames,
    setPlotData,
    simulationDoneCB,
    eModelScript,
    setSimulateStep,
  ]);

  return (
    <div className="relative h-full w-full">
      {secNames.length === 0 && <TraceLoader />}

      <div style={{ height: secNames.length > 0 ? '100vh' : '0vh' }} ref={containerRef} />

      {selectionCtrlConfig && (
        <PositionedPopover config={selectionCtrlConfig.position}>
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
        </PositionedPopover>
      )}
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

  return (
    <DefaultLoadingSuspense>
      <BlueNaas modelId={blueNaasModelId} />
    </DefaultLoadingSuspense>
  );
}
