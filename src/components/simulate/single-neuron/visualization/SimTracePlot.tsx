import { useRef, useEffect, useState } from 'react';
import Plotly, { Layout, Config } from 'plotly.js-dist-min';

import { PlotData } from '@/services/bluenaas-single-cell/types';

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
    title: { text: 'Voltage, mV', font: { size: 12 }, standoff: 6 },
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

type SimTracePlotProps = {
  data: PlotData;
  className?: string;
};

export default function SimTracePlot({ className, data }: SimTracePlotProps) {
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

  return <div style={{ border: '1px solid #424242' }} className={className} ref={containerRef} />;
}
