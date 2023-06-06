import React from 'react';
import Plotly, { PlotData } from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { convertVolts } from '@/util/explore-section/plotHelpers';
import useConfig from '@/components/explore-section/EphysViewerContainer/hooks/useConfig';
import optimizePlotData from '@/util/explore-section/optimizeTrace';
import { PlotProps } from '@/types/explore-section';

const Plot = createPlotlyComponent(Plotly);

const DEFAULT_RESPONSE_UNIT = 'mV';

function ResponsePlot({
  metadata,
  setSelectedSweeps,
  sweeps: { selectedSweeps, previewSweep, allSweeps, colorMapper },
  dataset,
  options,
  zoomRanges,
  onZoom,
}: PlotProps) {
  const isVolts = metadata && metadata.v_unit === 'volts';
  const { config, layout, font, style } = useConfig({ selectedSweeps });

  const rawData = React.useMemo(() => {
    const deltaTime = metadata ? metadata?.dt : 1;
    const zoom = {
      xstart: zoomRanges?.x[0],
      xend: zoomRanges?.x[1],
    };
    const allSweepsData = allSweeps.map((sweep) => {
      const name = options[`${dataset} ${sweep} v`]?.name;
      const y = options[`${dataset} ${sweep} v`] ? options[`${dataset} ${sweep} v`].y : [];
      const yConverted = isVolts ? convertVolts(y, DEFAULT_RESPONSE_UNIT) : y;
      const color = colorMapper[sweep];
      return {
        name,
        y: yConverted,
        line: {
          color,
        },
        sweepName: sweep,
      };
    });

    return optimizePlotData(allSweepsData, deltaTime, zoom) || [];
  }, [options, dataset, metadata, zoomRanges, allSweeps, isVolts, colorMapper]);

  const selectedResponse: Partial<PlotData>[] = React.useMemo(
    () => rawData?.filter((data) => selectedSweeps.includes(data.sweepName)),
    [options, dataset, selectedSweeps, metadata]
  );

  const previewDataResponse: Partial<PlotData>[] = React.useMemo(
    () =>
      rawData?.map((data: { sweepName: string }) => {
        const isSelected = selectedSweeps.includes(data.sweepName);
        const isPreview = data.sweepName === previewSweep;
        const opacity = isPreview || isSelected ? 1 : 0.05;
        return {
          ...data,
          opacity,
        };
      }),
    [previewSweep]
  );

  const handleClick = ({ data, curveNumber }: Readonly<Plotly.LegendClickEvent>): boolean => {
    const value: string = (data[curveNumber] as any).sweepName;
    const isSelected = selectedSweeps.includes(value);
    if (isSelected) {
      setSelectedSweeps(selectedSweeps.filter((sweep) => sweep !== value));
    } else {
      setSelectedSweeps([...selectedSweeps, value]);
    }
    return false;
  };

  const xTitle = metadata ? metadata.t_unit : '';

  const yTitle = isVolts ? DEFAULT_RESPONSE_UNIT : (metadata && metadata.v_unit) || '';

  const isEmptySelection = !selectedSweeps.length;
  const emptySelectionResponse = isEmptySelection ? rawData : selectedResponse;
  return (
    <Plot
      data={previewSweep ? previewDataResponse : emptySelectionResponse}
      onLegendClick={handleClick}
      onDoubleClick={() => false}
      onRelayout={(e) => {
        const {
          'xaxis.range[0]': x1,
          'xaxis.range[1]': x2,
          'yaxis.range[0]': y1,
          'yaxis.range[1]': y2,
        } = e;
        onZoom({ x: [x1, x2], y: [y1, y2] });
      }}
      layout={{
        title: 'Recording',
        xaxis: {
          title: {
            font,
            text: `Time (${xTitle})`,
          },
          range: zoomRanges?.x,
        },
        yaxis: {
          title: {
            font,
            text: `Membrane Potential (${yTitle})`,
          },
          range: zoomRanges?.y,
          zeroline: false,
        },
        autosize: true,
        ...layout,
      }}
      style={style}
      config={{ displaylogo: false, ...config }}
    />
  );
}

export default ResponsePlot;
