'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from 'antd';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import throttle from 'lodash/throttle';

import { PositionedPopover } from './PositionedPopover';
import TraceLoader from './TraceLoader';
import BlueNaasCls from '@/services/bluenaas-single-cell/blue-naas';
import { DEFAULT_DIRECT_STIM_CONFIG, DEFAULT_SIM_CONFIG } from '@/constants/simulate/single-neuron';
import { SimAction } from '@/types/simulate/single-neuron';
import { PlotData, TraceData } from '@/services/bluenaas-single-cell/types';
import {
  blueNaasInstanceRefAtom,
  simulationPlotDataAtom,
  secNamesAtom,
  segNamesAtom,
  simulationConfigAtom,
  singleNeuronAtom,
} from '@/state/simulate/single-neuron';
import { simulationDoneAtom } from '@/state/simulate/single-neuron-setter';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import { useSessionAtomValue } from '@/hooks/hooks';

const baseBannerStyle =
  'flex h-full items-center justify-center text-4xl bg-gray-950 text-gray-100';

type BlueNaasProps = {
  modelSelfUrl: string;
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

export function BlueNaas({ modelSelfUrl }: BlueNaasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [simConfig, dispatch] = useAtom(simulationConfigAtom);
  const setBlueNaasInstanceRef = useSetAtom(blueNaasInstanceRefAtom);
  const simulationDoneCB = useSetAtom(simulationDoneAtom);

  const blueNaasInstance = useRef<BlueNaasCls | null>(null);

  const [secNames, setSecNames] = useAtom(secNamesAtom);
  const setSegNames = useSetAtom(segNamesAtom);
  const setPlotData = useSetAtom(simulationPlotDataAtom);
  const session = useSessionAtomValue();

  const [selectionCtrlConfig, setSelectionCtrlConfig] = useState<SelectionCtrlConfig | null>(null);

  const onChange = (action: SimAction) => {
    dispatch(action);
  };

  const setInjection = () => {
    if (!selectionCtrlConfig) {
      throw new Error('SelectionCtrlConfig is not undefined');
    }

    const secName = selectionCtrlConfig.data.segName.replace(/_.*/, '');
    onChange({
      type: 'CHANGE_DIRECT_STIM_PROPERTY',
      payload: { key: 'injectTo', value: secName, stimulationId: '0' },
    });
  };

  const addRecording = () => {
    if (!selectionCtrlConfig) {
      throw new Error('SelectionCtrlConfig is not undefined');
    }

    const recordFrom = [...simConfig.recordFrom, selectionCtrlConfig.data.segName];
    onChange({
      type: 'CHANGE_RECORD_FROM',
      payload: recordFrom,
    });
  };

  useEffect(() => {
    if (!blueNaasInstance.current) return;

    blueNaasInstance.current.setConfig(simConfig);
  }, [simConfig]);

  useEffect(() => {
    if (!containerRef.current || !session?.accessToken) return;

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

      if (!initData.secNames.includes(DEFAULT_DIRECT_STIM_CONFIG.injectTo)) {
        throw new Error('No soma section present');
      }
      if (!initData.segNames.includes(DEFAULT_SIM_CONFIG.recordFrom[0])) {
        throw new Error('No soma segment present');
      }

      setBlueNaasInstanceRef(blueNaasInstance);
    };

    const onTraceData = throttle((data: TraceData) => {
      const updatedPlotData: PlotData = data.map((entry) => ({
        x: entry.t,
        y: entry.v,
        type: 'scatter',
        name: entry.label,
      }));
      setPlotData(updatedPlotData);
    }, 100);

    blueNaasInstance.current = new BlueNaasCls(
      containerRef.current,
      modelSelfUrl,
      DEFAULT_SIM_CONFIG,
      session.accessToken,
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
    modelSelfUrl,
    setBlueNaasInstanceRef,
    setSecNames,
    setSegNames,
    setPlotData,
    simulationDoneCB,
    session,
  ]);

  return (
    <div className="relative h-full w-full">
      {secNames.length === 0 && <TraceLoader />}

      <div style={{ height: secNames.length > 0 ? '100vh' : '0vh' }} ref={containerRef} />

      {selectionCtrlConfig && (
        <PositionedPopover config={selectionCtrlConfig.position}>
          <Button
            onClick={setInjection}
            disabled={
              simConfig.directStimulation?.[0].injectTo ===
              selectionCtrlConfig.data.segName.replace(/_.*/, '')
            }
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
  const modelSelfUrl = useAtomValue(singleNeuronAtom);

  const [blueNaasModelSelfUrl, setBlueNaasModelSelfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!modelSelfUrl) return;

    const init = () => {
      setLoading(true);
      setBlueNaasModelSelfUrl(modelSelfUrl?.self ?? null);
    };

    init();

    return () => {
      setBlueNaasModelSelfUrl(null);
    };
  }, [modelSelfUrl]);

  if (!blueNaasModelSelfUrl) {
    const msg = loading ? 'Loading...' : 'Select a leaf region and an already built E-Model';

    return <div className={baseBannerStyle}>{msg}</div>;
  }

  return (
    <DefaultLoadingSuspense>
      <BlueNaas modelSelfUrl={blueNaasModelSelfUrl} />
    </DefaultLoadingSuspense>
  );
}
