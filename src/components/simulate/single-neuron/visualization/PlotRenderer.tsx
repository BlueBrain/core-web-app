'use client';

import { useRef, useEffect, useState } from 'react';
import { Button, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Plotly, { Layout, Config } from 'plotly.js-dist-min';
import lodashSet from 'lodash/set';

import LegendItem from './LegendItem';
import { PlotData, PlotDataEntry } from '@/services/bluenaas-single-cell/types';
import { exportSingleSimulationResultAsZip } from '@/util/simulation-plotly-to-csv';
import { classNames } from '@/util/utils';

const PLOT_LAYOUT: Partial<Layout> = {
  plot_bgcolor: '#fff',
  paper_bgcolor: '#fff',
  autosize: true,
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
  legend: {
    orientation: 'h',
    yanchor: 'top',
    xanchor: 'center',
    x: 0.5,
    y: 1.15,
  },
};

const PLOT_CONFIG: Partial<Config> = {
  displayModeBar: false,
  responsive: true,
  displaylogo: false,
};

type PlotConfig = {
  yAxisTitle?: string;
  showDefaultLegends?: boolean;
};

type BasicProps = {
  name?: string;
  type: 'stimulus' | 'simulation';
  data: PlotData;
  className?: string;
  isLoading?: boolean;
  plotConfig?: PlotConfig;
  isDownloadable?: boolean;
  onlyAmplitudeLegend?: boolean;
  bordered?: boolean;
};

type Props =
  | (BasicProps & {
      withTitle: true;
      title: React.ReactNode;
    })
  | (BasicProps & {
      withTitle: false;
      title: null;
    });

export default function PlotRenderer({
  className,
  name,
  type,
  data,
  isLoading,
  plotConfig,
  withTitle,
  title,
  isDownloadable = false,
  onlyAmplitudeLegend = true,
  bordered = false,
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

    lodashSet(PLOT_LAYOUT, 'showlegend', Boolean(plotConfig?.showDefaultLegends));

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
      {!isLoading && data.length && !plotConfig?.showDefaultLegends && (
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
      <div className="relative w-full p-2">
        <div className="flex items-center justify-between gap-4">
          {withTitle && title && (
            <div className="flex h-10 items-center justify-center bg-primary-8 px-4 py-2 text-base text-white">
              {title}
            </div>
          )}
          <div className="ml-auto flex items-center gap-2 self-end">
            {isDownloadable && !isLoading && (
              <Button
                type="primary"
                size="middle"
                htmlType="button"
                icon={<DownloadOutlined />}
                onClick={onDownloadPlotDataCsv}
                className={classNames(
                  'h-10 rounded-none border border-primary-8 bg-white text-primary-8',
                  bordered && 'border-b-0'
                )}
              >
                Download
              </Button>
            )}
          </div>
        </div>
        <div
          className={classNames(
            'relative flex h-full  w-full flex-col items-center justify-center px-2 pt-8',
            bordered && 'border border-primary-8 '
          )}
        >
          <div className="h-full w-[calc(100%-2rem)]">
            <div
              className={classNames(className, 'w-full')}
              ref={containerRef}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            />
            {isLoading && (
              <div className="absolute top-0 flex h-full w-full items-center justify-center text-sm text-gray-500">
                <Spin size="large" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
