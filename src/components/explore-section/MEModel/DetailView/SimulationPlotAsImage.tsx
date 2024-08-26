import { useEffect, useState } from 'react';
import { Layout } from 'plotly.js-dist-min';
import { Empty, Skeleton } from 'antd';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

import { PlotData } from '@/services/bluenaas-single-cell/types';

const makePlotLayout = ({
  title,
  xTitle = 'Time [ms]',
  yTitle = 'Current [nA]',
}: {
  title: string;
  xTitle?: string;
  yTitle?: string;
}): Partial<Layout> => {
  return {
    title: {
      text: title,
      font: { color: '#003A8C', size: 24 },
      x: 0.001,
      xref: 'paper',
      yref: 'paper',
      pad: { l: 0, r: 0, t: 20, b: 40 },
      // @ts-ignore
      automargin: true,
    },
    plot_bgcolor: '#fff',
    paper_bgcolor: '#fff',
    xaxis: {
      automargin: true,
      color: '#003A8C',
      zeroline: false,
      showline: true,
      linecolor: '#888888',
      title: { text: xTitle, font: { size: 12 }, standoff: 6 },
    },
    yaxis: {
      automargin: true,
      color: '#003A8C',
      zeroline: false,
      showline: true,
      linecolor: '#888888',
      title: { text: yTitle, font: { size: 12 }, standoff: 6 },
    },
    showlegend: true,
    margin: { t: 20, r: 20, b: 20, l: 20 },
  };
};

export default function SimulationPlotAsImage({
  title,
  plotData,
}: {
  title: string;
  plotData: PlotData;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      (async () => {
        setLoading(true);
        const Plotly = await import('plotly.js-dist-min');
        const url = await Plotly.toImage(
          { data: plotData, layout: makePlotLayout({ title, yTitle: 'Voltage [mv]' }) },
          { format: 'webp', width: 700, height: 500 }
        );
        setImage(url);
      })();
    }
  }, [plotData, title, inView]);

  if (image) {
    return (
      <div className="relative flex h-96 w-full max-w-2xl items-center justify-center">
        <Image
          fill
          objectFit="contains"
          alt="Stimulus plot"
          className="border border-neutral-2"
          src={image}
        />
      </div>
    );
  }

  return (
    <div ref={ref} className="flex h-96 w-full max-w-2xl items-center justify-center">
      {loading ? (
        <Skeleton.Image
          active={loading}
          className="!h-full !w-full rounded-none"
          rootClassName="!h-full !w-full"
        />
      ) : (
        <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}
