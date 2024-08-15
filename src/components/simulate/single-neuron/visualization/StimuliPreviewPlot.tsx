'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { captureException } from '@sentry/nextjs';

import PlotRenderer from './PlotRenderer';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import { protocolNameAtom, stimulusPreviewPlotDataAtom } from '@/state/simulate/single-neuron';
import { getDirectCurrentGraph } from '@/api/bluenaas';
import { getSession } from '@/authFetch';
import useNotification from '@/hooks/notifications';

type Props = {
  configId: string;
  amplitudes: number[];
  modelSelfUrl: string;
};

export default function StimuliPreviewPlot({ configId, amplitudes, modelSelfUrl }: Props) {
  const renderRef = useRef(false);
  const protocolName = useAtomValue(protocolNameAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [stimuliPreviewPlotData, setStimuliPreviewPlotData] = useAtom(stimulusPreviewPlotDataAtom);
  const { error: notifyError } = useNotification();

  const updateStimuliPreview = useCallback(async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session || !protocolName) {
        return;
      }

      const rawPlotData = await getDirectCurrentGraph(modelSelfUrl, session.accessToken, {
        amplitudes,
        stimulusProtocol: protocolName,
      });

      const plotData: PlotData = rawPlotData.map((d) => ({
        type: 'scatter',
        ...d,
      }));
      setStimuliPreviewPlotData([
        ...stimuliPreviewPlotData,
        {
          id: configId,
          data: plotData,
        },
      ]);
      renderRef.current = true;
    } catch {
      captureException(new Error('Preview plot could not be retrived for model'));
      notifyError('Error while loading stimulus plot data', undefined, 'topRight');
    } finally {
      setLoading(false);
    }
  }, [
    protocolName,
    stimuliPreviewPlotData,
    modelSelfUrl,
    amplitudes,
    configId,
    notifyError,
    setStimuliPreviewPlotData,
  ]);

  useEffect(() => {
    if (!renderRef.current) {
      updateStimuliPreview();
    }
  }, [updateStimuliPreview]);

  return (
    <PlotRenderer
      className="min-h-[320px]"
      isLoading={loading}
      data={stimuliPreviewPlotData.find((o) => o.id === configId)?.data ?? []}
      plotConfig={{
        yAxisTitle: 'Current, nA',
      }}
    />
  );
}
