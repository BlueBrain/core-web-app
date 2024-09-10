import { useEffect, useState } from 'react';
import { Layout } from 'plotly.js-dist-min';
import { Empty, Skeleton } from 'antd';
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
  yTitle,
  plotData,
  size,
}: {
  title?: string;
  yTitle?: string;
  plotData: PlotData;
  size?: {
    w: number;
    h: number;
  };
}) {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function constructThumbnail() {
      try {
        setError(false);
        setLoading(true);
        const Plotly = await import('plotly.js-dist-min');
        const url = await Plotly.toImage(
          {
            data: plotData,
            layout: makePlotLayout({ title: title ?? '', yTitle: yTitle ?? 'Voltage [mv]' }),
          },
          {
            format: 'webp',
            width: size?.w ?? 600,
            height: size?.h ?? 500,
          }
        );
        setImage(url);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    constructThumbnail();
  }, [plotData, title, yTitle, size]);

  if (error) {
    return (
      <Empty
        description="Error while constructing thumbnail"
        image={Empty.PRESENTED_IMAGE_DEFAULT}
      />
    );
  }

  if (image) {
    return (
      <div className="relative flex h-96 w-full items-center justify-center">
        <Image
          fill
          objectFit="contains"
          alt="plot"
          className="border border-neutral-2"
          src={image}
        />
      </div>
    );
  }

  return (
    <div className="flex h-96 w-full items-center justify-center">
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
