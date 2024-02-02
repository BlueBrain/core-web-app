import Image from 'next/image';

type ImageReportProps = {
  imageSource: string;
  title: string;
};

export default function ImageReport({ imageSource, title }: ImageReportProps) {
  return (
    <div>
      {title && <div className="my-3 text-base font-bold capitalize">{title}</div>}
      <Image alt={title} src={imageSource} height={311} width={425} />
    </div>
  );
}
