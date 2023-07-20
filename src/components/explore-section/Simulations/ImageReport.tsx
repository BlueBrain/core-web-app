type ImageReportProps = {
  imageSource: string;
  title?: string;
};

export default function ImageReport({ imageSource, title }: ImageReportProps) {
  return (
    <div>
      {title && <div className="font-bold my-3 text-base">{title}</div>}
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src={imageSource} />
    </div>
  );
}
