'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { captureException } from '@sentry/nextjs';

import PlotRenderer from './PlotRenderer';
import useNotification from '@/hooks/notifications';

import { stimulusPreviewPlotDataAtom } from '@/state/simulate/single-neuron';
import { getSession } from '@/authFetch';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import { getDirectCurrentGraph } from '@/api/bluenaas';
import { SIMULATION_COLORS } from '@/constants/simulate/single-neuron';
import { StimulusModule } from '@/types/simulation/single-neuron';

type Props = {
  modelSelfUrl: string;
  amplitudes: number[];
  protocol: StimulusModule;
};

export default function StimuliPreviewPlot({ modelSelfUrl, amplitudes, protocol }: Props) {
  const [stimuliPreviewPlotData, setStimuliPreviewPlotData] = useAtom(stimulusPreviewPlotDataAtom);
  const [loading, setLoading] = useState(false);
  const previousFetchController = useRef<AbortController>();

  const { error: notifyError } = useNotification();

  const cancelPreviousRequest = () => {
    if (previousFetchController.current) {
      previousFetchController.current.abort();
    }
    const controller = new AbortController();
    previousFetchController.current = controller;
    return controller;
  };

  const updateStimuliPreview = useCallback(async () => {
    const controller = cancelPreviousRequest();

    try {
      setLoading(true);
      const session = await getSession();
      if (!session) {
        throw new Error('No user session found');
      }

      if (!amplitudes || !protocol) {
        throw new Error('No Stimulus protocol found');
      }

      const rawPlotData = await getDirectCurrentGraph(
        modelSelfUrl,
        session.accessToken,
        {
          amplitudes,
          stimulusProtocol: protocol,
        },
        controller.signal
      );

      const plotData: PlotData = rawPlotData.map((d, i) => ({
        type: 'scatter',
        line: { color: SIMULATION_COLORS[i] }, // Since we limit the number of amperages to 15 these colors should be enought
        ...d,
      }));

      setStimuliPreviewPlotData(plotData);
    } catch (error) {
      if (!controller.signal.aborted) {
        captureException(new Error('Preview plot could not be retrived for model'));
        notifyError(
          'Error while loading stimulus plot data',
          undefined,
          'topRight',
          true,
          'plor-error'
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [amplitudes, protocol, modelSelfUrl, notifyError, setStimuliPreviewPlotData]);

  useEffect(() => {
    updateStimuliPreview();
  }, [updateStimuliPreview]);

  return (
    <PlotRenderer
      type="stimulus"
      name={`${protocol}_plots`}
      className="min-h-[320px]"
      isLoading={loading}
      data={stimuliPreviewPlotData ?? []}
      plotConfig={{
        yAxisTitle: 'Current [nA]',
      }}
    />
  );
}
