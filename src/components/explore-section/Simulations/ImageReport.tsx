type ImageReportProps = {
  imageSource: string;
  title?: string;
};

export default function ImageReport({ imageSource, title }: ImageReportProps) {
  return (
    <div>
      {title && <div className="font-bold my-3 text-base">{title}</div>}
      <img src={imageSource} />
    </div>
  );
}
