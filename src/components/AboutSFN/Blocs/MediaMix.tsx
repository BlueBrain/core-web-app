import Image from 'next/image';

import slugify from '@/util/slugify';
import { classNames } from '@/util/utils';

export default function MediaMix({
  layout,
  title,
  subtitle,
  paragraphs,
  image = '/images/about/placeholder_image_mixcontent.png',
  id,
}: {
  layout: 'left' | 'right';
  title: string;
  subtitle: string;
  paragraphs: string[];
  image: string;
  id: string;
}) {
  return (
    <div
      className={classNames(
        'relative flex min-h-screen w-full items-center',
        layout === 'left' ? 'flex-row' : 'flex-row-reverse'
      )}
      id={slugify(id)}
    >
      <div
        className={classNames('absolute ', layout === 'left' ? '-right-[20vw]' : '-left-[20vw]')}
      >
        <Image src={image} alt="placeholder image" width={800} height={800} />
      </div>

      <div className="relative flex w-1/2 flex-col">
        <header className="mb-12 uppercase leading-[0.92] tracking-wider">
          <h2 className="text-[100px] font-bold">{title}</h2>
          <h3 className="text-3xl uppercase text-primary-3">{subtitle}</h3>
        </header>
        <div className="relative flex flex-col">
          {paragraphs.map((paragraph: string, index: number) => (
            <div
              key={`about-introduction-paragraph-${index + 1}`}
              className="font-sans text-3xl font-normal leading-normal"
            >
              {index !== 0 && <div className="mb-5 mt-3 block h-8 w-px bg-primary-3" />}
              <p className="hyphens-auto text-xl font-light">{paragraph}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
