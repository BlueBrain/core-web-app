'use client';

import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { captureException } from '@sentry/nextjs';

import PlotRenderer from './PlotRenderer';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import { protocolNameAtom } from '@/state/simulate/single-neuron';
import { getStimuliPlot } from '@/api/simulation/single-neuron';
import { useAccessToken } from '@/hooks/useAccessToken';
import { useDebouncedCallback } from '@/hooks/hooks';

type Props = {
  amplitudes: number[];
  modelSelfUrl: string;
};

export default function StimuliPreviewPlot({ amplitudes, modelSelfUrl }: Props) {
  const token = useAccessToken();
  const [stimuliPreviewPlotData, setStimuliPreviewPlotData] = useState<PlotData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const protocolName = useAtomValue(protocolNameAtom);

  const updateStimuliPreview = useDebouncedCallback(
    async (amplitudesToRender, protocolToRender, accessToken) => {
      try {
        const rawPlotData = await getStimuliPlot(modelSelfUrl, accessToken, {
          amplitudes: amplitudesToRender,
          stimulusProtocol: protocolToRender,
        });

        const plotData: PlotData = rawPlotData.map((d) => ({
          type: 'scatter',
          ...d,
        }));

        setStimuliPreviewPlotData(plotData);
      } catch {
        // TODO: Show error state to user
        captureException(new Error('Preview plot could not be retrived for model'));
      } finally {
        setLoading(false);
      }
    },
    [modelSelfUrl],
    1500
  );

  useEffect(() => {
    if (!token) {
      return;
    }
    setLoading(true);
    updateStimuliPreview(amplitudes, protocolName, token);
  }, [amplitudes, protocolName, token, updateStimuliPreview]);

  return (
    <PlotRenderer
      className="min-h-[320px]"
      isLoading={loading}
      data={stimuliPreviewPlotData ?? []}
      plotConfig={{
        yAxisTitle: 'Current, nA',
      }}
    />
  );
}
