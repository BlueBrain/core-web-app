import { PreviewApiPlotNames, PreviewApiPlotResponse } from '@/types/m-model';

const titleStyle = 'ml-8 font-bold text-primary-8 text-xl';

type PlotRendererProps = {
  plotResponse: PreviewApiPlotResponse | undefined;
  plotName: PreviewApiPlotNames;
  title: string;
};

export default function PlotRenderer({ plotResponse, plotName, title }: PlotRendererProps) {
  const plotBase64Src = plotResponse?.[plotName].src;
  return (
    <div>
      <h2 className={titleStyle}>{title}</h2>
      {!plotBase64Src && <div className="ml-8 my-4 text-primary-8">Loading...</div>}
      {plotBase64Src && (
        <img
          style={{ objectFit: 'contain' }}
          src={`data:image/png;base64, ${plotBase64Src}`}
          alt={title}
        />
      )}
    </div>
  );
}
