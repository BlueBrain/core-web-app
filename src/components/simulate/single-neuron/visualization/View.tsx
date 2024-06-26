'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from 'antd';
import { useAtom, useSetAtom } from 'jotai';

import throttle from 'lodash/throttle';

import { PositionedPopover } from './PositionedPopover';
import TraceLoader from './TraceLoader';
import { useEModelUUID } from '@/services/bluenaas-single-cell/hooks';
import BlueNaasCls from '@/services/bluenaas-single-cell/blue-naas';
import { DEFAULT_SIM_CONFIG } from '@/constants/simulate/single-neuron';
import { SimAction } from '@/types/simulate/single-neuron';
import { PlotData, TraceData } from '@/services/bluenaas-single-cell/types';
import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import {
  blueNaasInstanceRefAtom,
  simulationPlotDataAtom,
  secNamesAtom,
  segNamesAtom,
  simulationConfigAtom,
} from '@/state/simulate/single-neuron';
import { simulationDoneAtom } from '@/state/simulate/single-neuron-setter';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import { useSessionAtomValue } from '@/hooks/hooks';

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

      if (!initData.secNames.includes(DEFAULT_SIM_CONFIG.injectTo)) {
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
      modelId,
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
    modelId,
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
  const [selectedEModel, setSelectedEModel] = useAtom(selectedEModelAtom);

  const eModelUUID = useEModelUUID();

  const [blueNaasModelId, setBlueNaasModelId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // TODO: remove this when model fetchable from backend
  useEffect(() => {
    setSelectedEModel({
      name: 'EM__1372346__cADpyr__13',
      id: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/e990f748-a856-4be0-a7d3-9f0bc336447c',
      eType: 'cADpyr',
      mType: 'L5_TPC:A',
      isOptimizationConfig: false,
      rev: 10,
      brainRegion: 'http://api.brain-map.org/api/v2/data/Structure/8',
    });
  }, [setSelectedEModel]);

  useEffect(() => {
    if (!eModelUUID || selectedEModel?.isOptimizationConfig) return;

    const init = async () => {
      setBlueNaasModelId(null);
      setLoading(true);
      setBlueNaasModelId(eModelUUID);
    };

    init();
  }, [eModelUUID, selectedEModel?.isOptimizationConfig]);

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
