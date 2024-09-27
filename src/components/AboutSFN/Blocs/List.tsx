'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import slugify from '@/util/slugify';
import { classNames } from '@/util/utils';

export default function List({
  title,
  subtitle,
  list,
  setActiveSection,
  id,
}: {
  title?: string;
  subtitle?: string;
  list: string[];
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
      className="relative flex w-full flex-col px-8 py-[10vh] md:grid md:min-h-screen md:snap-start md:grid-cols-2 md:self-center md:px-[16vw] md:py-[20vh]"
      id={slugify(id)}
      ref={ref}
    >
      {title && (
        <div className="mb-12 flex h-full flex-col justify-center uppercase tracking-wider md:mb-0">
          <h3 className="text-2xl text-primary-3 md:text-3xl">{subtitle}</h3>
          <h2 className="text-6xl font-bold md:text-8xl">{title}</h2>
        </div>
      )}
      <div className="flex flex-col pt-3">
        {list.map((item: string, index: number) => (
          <div
            className={classNames(
              'transition-opacity duration-300 ease-linear',
              inView ? 'opacity-100' : 'opacity-0'
            )}
            key={`list-item-${index + 1}`}
            style={{ transitionDelay: `${(index + 1) * 200}ms` }}
          >
            {index !== 0 && <div className="my-3 block h-5 w-px bg-primary-3" />}
            <h3 className="font-sans text-2xl font-normal text-opacity-85 transition-opacity duration-300 ease-linear hover:opacity-100">
              {item}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
