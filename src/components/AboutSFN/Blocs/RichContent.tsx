'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import slugify from '@/util/slugify';

export default function RichContent({
  title,
  subtitle,
  paragraphs,
  image,
  setActiveSection,
  id,
}: {
  title: string;
  subtitle: string;
  paragraphs: string[];
  image: string;
  setActiveSection: (section: string) => void;
  id: string;
}) {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection(id);
    }
  }, [inView, id, setActiveSection]);

  return (
    <div
      className="relative mb-16 flex w-full flex-col px-[10vw] py-8 md:mb-0 md:min-h-screen md:snap-start md:px-[16vw] md:py-[15vh]"
      id={slugify(id)}
      ref={ref}
    >
      <header className="mb-12 flex flex-col uppercase leading-[0.9] tracking-[0.1em]">
        <h2 className="mb-3 text-4xl font-bold md:text-6xl xl:text-8xl">{title}</h2>
        <h3 className="text-3xl uppercase text-primary-3">{subtitle}</h3>
      </header>
      <div className="flex flex-row gap-x-10 font-sans text-xl font-light leading-normal">
        <div className="relative top-4 hidden h-px w-56 bg-white md:block" />
        {paragraphs.map((paragraph: string, index: number) => (
          <p key={`paragraph_${index + 1}`}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-10 w-full md:mt-4">
        <Image
          width={1500}
          height={844}
          src={image}
          alt={title}
          className="aspect-video object-fill object-center"
        />
      </div>
    </div>
  );
}
