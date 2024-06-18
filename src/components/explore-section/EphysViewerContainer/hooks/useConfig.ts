import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { Config, Font, Layout } from 'plotly.js-dist-min';
import { CSSProperties } from 'react';

interface UseConfigResponse {
  layout: Partial<Layout>;
  config: Partial<Config>;
  antBreakpoints: any;
  font: Partial<Font>;
  style: CSSProperties;
}

const useConfig = (): UseConfigResponse => {
  const antBreakpoints = useBreakpoint();

  return {
    antBreakpoints,
    config: {
      displayModeBar: antBreakpoints.md,
      responsive: true,
    },
    layout: {
      showlegend: false,
      legend: antBreakpoints.md
        ? {}
        : {
            x: 1,
            xanchor: 'right',
            y: 1,
          },
      margin: antBreakpoints.md ? { l: 55, r: 0, t: 50, b: 50 } : { l: 45, r: 0, t: 30, b: 35 },
    },
    font: antBreakpoints.md
      ? {}
      : {
          size: 12,
        },
    style: {
      width: '100%',
      height: '40vh',
    },
  };
};

export default useConfig;
