'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import slugify from '@/util/slugify';
import { classNames } from '@/util/utils';

export default function MediaMix({
  layout,
  title,
  subtitle,
  paragraphs,
  image = '/images/about/placeholder_image_mixcontent.png',
  setActiveSection,
  id,
}: {
  layout: 'left' | 'right';
  title: string;
  subtitle: string;
  paragraphs: string[];
  image: string;
  setActiveSection: (section: string) => void;
  id: string;
}) {
  const { ref, inView } = useInView({
    threshold: 1,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection(id);
    }
  }, [inView, id, setActiveSection]);

  return (
    <div
      className={classNames(
        'relative flex w-full items-center px-8 py-8 md:min-h-screen md:snap-start md:px-[16vw] md:py-[20vh]',
        layout === 'left' ? 'flex-row' : 'flex-row-reverse'
      )}
      id={slugify(id)}
      ref={ref}
    >
      <div
        className={classNames(
          'absolute opacity-20 md:opacity-100',
          layout === 'left' ? '-right-[20vw] lg:-right-[6vw]' : '-left-[20vw] lg:-left-[6vw]'
        )}
      >
        <Image
          src={image}
          alt={title}
          width={800}
          height={800}
          className={classNames(
            'object-contain object-center',
            inView
              ? 'scale-125 transform opacity-100 transition-all duration-100 ease-in-out'
              : 'scale-100 opacity-0'
          )}
        />
      </div>

      <div className="relative flex w-full flex-col md:w-1/2">
        <header className="mb-12 uppercase leading-[0.92] tracking-wider">
          <h2 className="text-6xl font-bold md:text-[100px]">{title}</h2>
          <h3 className="text-xl uppercase text-primary-3 md:text-3xl">{subtitle}</h3>
        </header>
        <div className="relative flex flex-col">
          {paragraphs.map((paragraph: string, index: number) => (
            <div
              key={`about-introduction-paragraph-${index + 1}`}
              className="font-sans text-3xl font-normal leading-normal"
            >
              {index !== 0 && (
                <div
                  className={classNames(
                    'mb-5 mt-3 block w-px bg-primary-3 transition-height delay-300 duration-500 ease-in-out',
                    inView ? 'h-8' : 'h-0'
                  )}
                />
              )}
              <p className="hyphens-auto text-2xl font-normal leading-normal md:text-xl md:font-light">
                {paragraph}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
