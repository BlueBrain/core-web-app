'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { captureException } from '@sentry/nextjs';

import PlotRenderer from './PlotRenderer';
import useNotification from '@/hooks/notifications';

import { stimulusPreviewPlotDataAtom } from '@/state/simulate/single-neuron';
import { getSession } from '@/authFetch';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import { currentInjectionSimulationConfigAtom } from '@/state/simulate/categories/current-injection-simulation';
import { getDirectCurrentGraph } from '@/api/bluenaas';
import { SIMULATION_COLORS } from '@/constants/simulate/single-neuron';

type Props = {
  modelSelfUrl: string;
  amplitudes: number[];
};

export default function StimuliPreviewPlot({ modelSelfUrl, amplitudes }: Props) {
  const currentInjectionConfig = useAtomValue(currentInjectionSimulationConfigAtom);
  const [stimuliPreviewPlotData, setStimuliPreviewPlotData] = useAtom(stimulusPreviewPlotDataAtom);
  const [loading, setLoading] = useState(false);
  const { error: notifyError } = useNotification();

  const config = currentInjectionConfig.at(0);
  const stimulusProtocol = config?.stimulus.stimulusProtocol;

  const updateStimuliPreview = useCallback(async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) {
        throw new Error('No user session found');
      }

      if (!amplitudes || !stimulusProtocol) {
        throw new Error('No Stimulus protocol found');
      }

      const rawPlotData = await getDirectCurrentGraph(modelSelfUrl, session.accessToken, {
        amplitudes,
        stimulusProtocol,
      });

      const plotData: PlotData = rawPlotData.map((d, i) => ({
        type: 'scatter',
        line: { color: SIMULATION_COLORS[i] }, // Since we limit the number of amperages to 15 these colors should be enought
        ...d,
      }));

      setStimuliPreviewPlotData(plotData);
    } catch {
      captureException(new Error('Preview plot could not be retrived for model'));
      notifyError(
        'Error while loading stimulus plot data',
        undefined,
        'topRight',
        true,
        'plor-error'
      );
    } finally {
      setLoading(false);
    }
  }, [amplitudes, stimulusProtocol, modelSelfUrl, notifyError, setStimuliPreviewPlotData]);

  useEffect(() => {
    updateStimuliPreview();
  }, [updateStimuliPreview]);

  return (
    <PlotRenderer
      className="min-h-[320px]"
      isLoading={loading}
      data={stimuliPreviewPlotData ?? []}
      plotConfig={{
        yAxisTitle: 'Current [nA]',
      }}
    />
  );
}
