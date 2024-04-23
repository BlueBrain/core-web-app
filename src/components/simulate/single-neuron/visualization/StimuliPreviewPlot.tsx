'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Plotly, { Layout, Config } from 'plotly.js-dist-min';
import debounce from 'lodash/debounce';
import { useAtomValue } from 'jotai';
import isEqual from 'lodash/isEqual';
import { Spin } from 'antd';

import { PlotData } from '@/services/bluenaas-single-cell/types';
import { blueNaasInstanceRefAtom } from '@/state/simulate/single-neuron';

const PLOT_LAYOUT: Partial<Layout> = {
  plot_bgcolor: '#141414',
  paper_bgcolor: '#141414',
  xaxis: {
    automargin: true,
    color: '#eaeaea',
    zeroline: false,
    showline: true,
    linecolor: '#888888',
    title: { text: 'Time, ms', font: { size: 12 }, standoff: 6 },
  },
  yaxis: {
    automargin: true,
    color: '#eaeaea',
    zeroline: false,
    showline: true,
    linecolor: '#888888',
    title: { text: 'Current, nA', font: { size: 12 }, standoff: 6 },
  },
  legend: {
    orientation: 'h',
    xanchor: 'center',
    x: 0.5,
    y: 1.1,
    font: { size: 10, color: '#eaeaea' },
  },
  height: 320,
  margin: { t: 0, r: 0, b: 20, l: 20 },
};

const PLOT_CONFIG: Partial<Config> = {
  displayModeBar: false,
  responsive: true,
  displaylogo: false,
};

type PreviewProps = {
  data: PlotData;
  className?: string;
  isLoading?: boolean;
};

function PreviewPlot({ className, data, isLoading }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    if (!initialized) {
      Plotly.newPlot(container, data, PLOT_LAYOUT, PLOT_CONFIG);
      setInitialized(true);
    } else {
      Plotly.react(container, data, PLOT_LAYOUT, PLOT_CONFIG);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      Plotly.purge(container);
    };
  }, [data, initialized]);

  return (
    <div className="relative">
      <div className={className} ref={containerRef} style={{ opacity: isLoading ? 0.5 : 1 }} />
      {isLoading && (
        <div className="absolute top-0 flex h-full w-full items-center justify-center text-sm text-gray-500">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}

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
    <PreviewPlot className="min-h-[320px]" isLoading={loading} data={stimuliPreviewPlotData} />
  );
}
