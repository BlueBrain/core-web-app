'use client';

import { useRef, useEffect, useState } from 'react';
import Plotly, { Layout, Config } from 'plotly.js-dist-min';
import { Button, Spin } from 'antd';
import lodashSet from 'lodash/set';
import { DownloadOutlined } from '@ant-design/icons';

import LegendItem from './LegendItem';
import { PlotData, PlotDataEntry } from '@/services/bluenaas-single-cell/types';
import { exportSingleSimulationResultAsZip } from '@/util/simulation-plotly-to-csv';

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
  showlegend: false,
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
  name?: string;
  type: 'stimulus' | 'simulation';
  data: PlotData;
  className?: string;
  isLoading?: boolean;
  plotConfig?: PlotConfig;
  isDownloadable?: boolean;
  onlyAmplitudeLegend?: boolean;
};

export default function PlotRenderer({
  className,
  name,
  type,
  data,
  isLoading,
  plotConfig,
  isDownloadable = false,
  onlyAmplitudeLegend = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [initialized, setInitialized] = useState<boolean>(false);
  const [refreshLegend, setRefreshLegend] = useState(false);

  const onDownloadPlotDataCsv = () => {
    exportSingleSimulationResultAsZip({
      type,
      name: name ?? 'plots',
      result: data,
    });
  };

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

  const isTraceVisible = (trace: PlotDataEntry) => trace.visible === undefined || trace.visible;

  const toggleTraceVisibility = (trace: PlotDataEntry, index: number) => {
    if (!containerRef.current) return;

    Plotly.restyle(containerRef.current!, { visible: !isTraceVisible(trace) }, [index]);

    setRefreshLegend((prev) => !prev);
  };

  const visibleTracesCount = data?.filter((t) => isTraceVisible(t)).length;

  return (
    <div className="relative mt-4 w-full px-3">
      {!isLoading && data.length && (
        <div className="py-4">
          <div className="flex w-full justify-between text-gray-400">
            <span className="text-base uppercase">Output Values</span>
            <span className="text-base">
              {visibleTracesCount}/{data.length} values displayed
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.map((trace, index) => (
              <LegendItem
                key={`${trace.name}-${refreshLegend}`}
                trace={trace}
                toggleVisibility={() => toggleTraceVisibility(trace, index)}
                isVisible={isTraceVisible(trace)}
                onlyAmplitude={onlyAmplitudeLegend}
              />
            ))}
          </div>
        </div>
      )}
      <div className="relative w-full">
        {isDownloadable && !isLoading && (
          <div className="flex flex-col items-end py-4">
            <Button
              type="primary"
              htmlType="button"
              icon={<DownloadOutlined />}
              onClick={onDownloadPlotDataCsv}
              className="border border-primary-8 bg-white text-primary-8"
            >
              Download
            </Button>
          </div>
        )}
        <div className={className} ref={containerRef} style={{ opacity: isLoading ? 0.5 : 1 }} />
        {isLoading && (
          <div className="absolute top-0 flex h-full w-full items-center justify-center text-sm text-gray-500">
            <Spin size="large" />
          </div>
        )}
      </div>
    </div>
  );
}
