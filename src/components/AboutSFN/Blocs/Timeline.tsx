'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import SliderChevronsNavigation from '../Buttons/SliderChevronsNavigation';
import { classNames } from '@/util/utils';

export type TimelineProps = {
  title: string;
  description: string;
  neurons: string;
  synapses?: string;
  astrocytes?: string;
  image: string;
};

export default function Timeline({
  content,
  id,
  setActiveSection,
}: {
  content: TimelineProps[];
  id: string;
  setActiveSection: (section: string) => void;
}) {
  const [activeKeyPoint, setActiveKeyPoint] = useState<number>(0);

  const handleItemChange = (direction: string) => {
    if (direction === 'prev') {
      setActiveKeyPoint((prev) => (prev === 0 ? content.length - 1 : prev - 1));
    } else {
      setActiveKeyPoint((prev) => (prev === content.length - 1 ? 0 : prev + 1));
    }
  };

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
        'relative flex w-full flex-col justify-center gap-x-20',
        'px-8 pb-8 pt-16 md:min-h-screen md:snap-start md:flex-row md:px-[8vw] md:py-[20vh]'
      )}
      id={id}
      ref={ref}
    >
      <div className="relative flex w-full items-center justify-center md:h-[80vh] md:w-1/2">
        <Image
          width={800}
          height={900}
          src={content[activeKeyPoint].image}
          alt={`Image of ${content[activeKeyPoint].title}`}
          className="relative -top-[8vh] rotate-0 scale-105 transition-transform duration-500 ease-in-out hover:rotate-6 hover:scale-[1.25]"
        />
      </div>

      <div className="relative -top-20 flex h-full w-full flex-col items-start justify-center md:top-0 md:w-1/2">
        <h3 className="mb-4 font-title text-4xl font-bold uppercase tracking-widest md:text-5xl">
          {content[activeKeyPoint].title}
        </h3>

        <aside className="flex w-full flex-row border border-solid border-primary-7 bg-primary-9 px-4 font-sans text-xl font-semibold text-primary-2 md:w-auto md:text-base">
          <div className="w-1/2 py-2 md:w-auto">{content[activeKeyPoint].neurons} neurons</div>
          {content[activeKeyPoint].synapses && (
            <>
              <div className="mx-4 block h-full w-px bg-primary-7" />
              <div className="w-1/2 py-2 md:w-auto">
                {content[activeKeyPoint].synapses} synapses
              </div>
            </>
          )}
          {content[activeKeyPoint].astrocytes && (
            <>
              <div className="mx-4 block h-full w-px bg-primary-7" />
              <div className="w-1/2 py-2 md:w-auto">
                {content[activeKeyPoint].astrocytes} astrocytes
              </div>
            </>
          )}
        </aside>
        <div className="mt-6 flex w-full flex-row gap-x-4">
          <SliderChevronsNavigation
            activeItem={activeKeyPoint}
            totalItems={content.length}
            setActiveItem={handleItemChange}
          />
        </div>

        <p className="my-8 font-sans text-2xl font-light leading-normal text-primary-1 md:text-lg">
          {content[activeKeyPoint].description}
        </p>
      </div>
    </div>
  );
}
