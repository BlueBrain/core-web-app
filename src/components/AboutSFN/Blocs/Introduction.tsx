'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { INTRODUCTION_PARAGRAPH } from '@/constants/about/about-content';
import { classNames } from '@/util/utils';

export default function Introduction({
  id = 'introduction',
  setActiveSection,
}: {
  id?: string;
  setActiveSection: (section: string) => void;
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
      className={classNames(
        'relative flex w-screen flex-col justify-start px-8 py-8 md:min-h-screen md:justify-center',
        'text-white md:w-full md:snap-start md:px-[16vw] md:py-[20vh]'
      )}
      id={id}
      ref={ref}
    >
      <h1 className="mb-12 text-6xl font-bold uppercase tracking-wider md:text-[100px]">about</h1>
      <div className="relative flex w-full flex-col gap-y-4">
        {INTRODUCTION_PARAGRAPH.map((paragraph: string, index: number) => (
          <div
            key={`about-introduction-paragraph-${paragraph.slice(0, 10)}`}
            className="hyphens-auto font-sans text-2xl font-normal leading-normal md:text-3xl"
          >
            {index !== 0 && (
              <div
                className={classNames(
                  'mb-6 mt-2 block w-px bg-primary-3 transition-height delay-300 duration-500 ease-in-out',
                  inView ? 'h-8' : 'h-0'
                )}
              />
            )}
            <p>{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
