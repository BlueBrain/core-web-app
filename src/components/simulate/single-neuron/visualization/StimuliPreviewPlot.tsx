'use client';

import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useAtomValue } from 'jotai';
import isEqual from 'lodash/isEqual';

import PlotRenderer from './PlotRenderer';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import { blueNaasInstanceRefAtom } from '@/state/simulate/single-neuron';

type Props = {
  amplitudes: number[];
};

export default function StimuliPreviewPlot({ amplitudes }: Props) {
  const [stimuliPreviewPlotData, setStimuliPreviewPlotData] = useState<PlotData | null>(null);
  const blueNaasInstanceRef = useAtomValue(blueNaasInstanceRefAtom);
  const [renderedAmplitudes, setRenderedAmplitudes] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onStimuliPreviewData = (data: PlotData) => {
    setStimuliPreviewPlotData(data);
    setLoading(false);
  };

  useEffect(() => {
    // initialize callbacks on ws
    if (!blueNaasInstanceRef?.current) return;

    blueNaasInstanceRef?.current.setCallbackStimuliPreview(onStimuliPreviewData);
  }, [blueNaasInstanceRef]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateStimuliPreview = useCallback(
    debounce((amplitudesToRender) => {
      if (isEqual(renderedAmplitudes, amplitudesToRender)) return;

      blueNaasInstanceRef?.current?.updateStimuliPreview(amplitudesToRender);
      setRenderedAmplitudes(amplitudesToRender);
    }, 1500),
    [blueNaasInstanceRef, renderedAmplitudes]
  );

  useEffect(() => {
    if (!blueNaasInstanceRef?.current) return;

    setLoading(true);
    updateStimuliPreview(amplitudes);
  }, [amplitudes, updateStimuliPreview, blueNaasInstanceRef]);

  if (!stimuliPreviewPlotData) return null;

  return (
    <PlotRenderer
      className="min-h-[320px]"
      isLoading={loading}
      data={stimuliPreviewPlotData}
      plotConfig={{
        yAxisTitle: 'Current, nA',
      }}
    />
  );
}
