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
      className="relative flex min-h-screen w-full flex-col px-[16vw] py-[20vh] md:snap-start"
      id={slugify(id)}
      ref={ref}
    >
      <header className="mb-12 flex flex-col uppercase leading-[0.9] tracking-[0.1em]">
        <h2 className="mb-3 text-[100px] font-bold">{title}</h2>
        <h3 className="text-3xl uppercase text-primary-3">{subtitle}</h3>
      </header>
      <div className="flex flex-row gap-x-10 font-sans text-xl font-light leading-normal">
        <div className="relative top-4 h-px w-56 bg-white" />
        {paragraphs.map((paragraph: string, index: number) => (
          <p key={`paragraph_${index + 1}`}>{paragraph}</p>
        ))}
      </div>
      <div className="w-full">
        <Image width={1920} height={1080} src={image} alt="placeholder image" />
      </div>
    </div>
  );
}
