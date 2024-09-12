import slugify from '@/util/slugify';
import Image from 'next/image';

export default function RichContent({
  title,
  subtitle,
  paragraphs,
  image,
}: {
  title: string;
  subtitle: string;
  paragraphs: string[];
  image: string;
}) {
  return (
    <div className="relative flex flex-col" id={slugify(title)}>
      <header className="mb-12 flex flex-col uppercase leading-[0.9] tracking-[0.1em]">
        <h2 className="mb-3 text-[100px] font-bold">{title}</h2>
        <h3 className="text-3xl uppercase text-primary-3">{subtitle}</h3>
      </header>
      <div className="flex flex-row gap-x-10 font-sans text-xl font-light leading-normal">
        <div className="relative top-4 h-px w-56 bg-white" />
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="w-full">
        <Image width={1920} height={1080} src={image} alt="placeholder image" />
      </div>
    </div>
  );
}
