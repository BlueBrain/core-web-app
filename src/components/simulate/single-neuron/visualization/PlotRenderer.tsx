'use client';

import { useRef, useEffect, useState } from 'react';
import Plotly, { Layout, Config } from 'plotly.js-dist-min';
import { Spin } from 'antd';
import lodashSet from 'lodash/set';

import { PlotData } from '@/services/bluenaas-single-cell/types';

const PLOT_LAYOUT: Partial<Layout> = {
  plot_bgcolor: '#fff',
  paper_bgcolor: '#fff',
  xaxis: {
    automargin: true,
    color: '#003A8C',
    zeroline: false,
    showline: true,
    linecolor: '#888888',
    title: { text: 'Time [ms]', font: { size: 12 }, standoff: 6 },
  },
  yaxis: {
    automargin: true,
    color: '#003A8C',
    zeroline: false,
    showline: true,
    linecolor: '#888888',
    title: { text: 'Current [nA]', font: { size: 12 }, standoff: 6 },
  },
  legend: {
    orientation: 'h',
    xanchor: 'center',
    x: 0.5,
    y: 1.1,
    font: { size: 10, color: '#003A8C' },
  },
  height: 320,
  margin: { t: 20, r: 20, b: 20, l: 20 },
};

const PLOT_CONFIG: Partial<Config> = {
  displayModeBar: false,
  responsive: true,
  displaylogo: false,
};

type PlotConfig = {
  yAxisTitle?: string;
};

type Props = {
  data: PlotData;
  className?: string;
  isLoading?: boolean;
  plotConfig?: PlotConfig;
};

export default function PlotRenderer({ className, data, isLoading, plotConfig }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    if (plotConfig?.yAxisTitle) {
      lodashSet(PLOT_LAYOUT, 'yaxis.title.text', plotConfig.yAxisTitle);
    }

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
  }, [data, initialized, plotConfig]);

  return (
    <div className="relative w-full">
      <div className={className} ref={containerRef} style={{ opacity: isLoading ? 0.5 : 1 }} />
      {isLoading && (
        <div className="absolute top-0 flex h-full w-full items-center justify-center text-sm text-gray-500">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}
