import { SynthesisPreviewApiPlotNames, SynthesisPreviewApiPlotResponse } from '@/types/m-model';

const titleStyle = 'ml-8 font-bold text-primary-8 text-xl';

type PlotRendererProps = {
  plotResponse: SynthesisPreviewApiPlotResponse | undefined;
  plotName: SynthesisPreviewApiPlotNames;
  title: string;
};

export default function PlotRenderer({ plotResponse, plotName, title }: PlotRendererProps) {
  const plotBase64Src = plotResponse?.[plotName].src;
  return (
    <div>
      <h2 className={titleStyle}>{title}</h2>
      {!plotBase64Src && <div className="my-4 ml-8 text-primary-8">Loading...</div>}
      {plotBase64Src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          style={{ objectFit: 'contain' }}
          src={`data:image/png;base64, ${plotBase64Src}`}
          alt={title}
        />
      )}
    </div>
  );
}
