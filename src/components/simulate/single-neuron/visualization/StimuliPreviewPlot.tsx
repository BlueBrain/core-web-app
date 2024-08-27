'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { captureException } from '@sentry/nextjs';
import isEqual from 'lodash/isEqual';

import PlotRenderer from './PlotRenderer';
import useNotification from '@/hooks/notifications';

import { stimulusPreviewPlotDataAtom } from '@/state/simulate/single-neuron';
import { getSession } from '@/authFetch';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import useCurrentInjectionSimulationConfig, { currentInjectionSimulationConfigAtom } from '@/state/simulate/categories/current-injection-simulation';
import { getDirectCurrentGraph } from '@/api/bluenaas';

type Props = {
  modelSelfUrl: string;
  amplitudes: number[];
  stimulationId: number;
};

export default function StimuliPreviewPlot({ modelSelfUrl, amplitudes, stimulationId }: Props) {
  const { setAmplitudes } = useCurrentInjectionSimulationConfig();
  const currentInjectionConfig = useAtomValue(currentInjectionSimulationConfigAtom);
  const [stimuliPreviewPlotData, setStimuliPreviewPlotData] = useAtom(stimulusPreviewPlotDataAtom);
  const [loading, setLoading] = useState(false);
  const { error: notifyError } = useNotification();
  const config = currentInjectionConfig.at(0);
  const stimulusProtocol = config?.stimulus.stimulusProtocol;
  const amplitudesRef = useRef<Array<number>>([]);
  console.log('@@amplitudesRef', amplitudesRef.current)
  console.log('@@amplitudes', amplitudes)
  const updateStimuliPreview = useCallback(async (signal?: AbortSignal) => {
    try {
      const session = await getSession();
      if (!session) {
        throw new Error('No user session found');
      }

      if (!amplitudes || !stimulusProtocol) {
        throw new Error('No Stimulus protocol found');
      }
      console.log('@@-->', amplitudesRef.current, amplitudes, isEqual(amplitudesRef.current, amplitudes))
      if (!isEqual(amplitudesRef.current, amplitudes)) {
        setLoading(true);
        setAmplitudes({ id: stimulationId, newValue: amplitudes });
        amplitudesRef.current = amplitudes;
        const rawPlotData = await getDirectCurrentGraph(modelSelfUrl, session.accessToken, {
          amplitudes,
          stimulusProtocol,
        }, signal,);

        const plotData: PlotData = rawPlotData.map((d) => ({
          type: 'scatter',
          ...d,
        }));

        setStimuliPreviewPlotData(plotData);
      }
    } catch (e) {
      if ((e as { name: string }).name !== "AbortError") {
        captureException(new Error('Preview plot could not be retrived for model'));
        notifyError('Error while loading stimulus plot data', undefined, 'topRight');
      }
    } finally {
      setLoading(false);
    }
  }, [
    amplitudes,
    stimulationId,
    modelSelfUrl,
    stimulusProtocol,
    setAmplitudes,
    setStimuliPreviewPlotData, notifyError
  ]);

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
