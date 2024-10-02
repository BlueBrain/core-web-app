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
        'relative mt-20 flex w-full flex-col justify-center gap-x-20 md:mt-0',
        'px-8 pb-8 pt-16 md:min-h-screen md:snap-start md:flex-row md:px-[8vw] md:py-[18vh]'
      )}
      id={id}
      ref={ref}
    >
      <div className="relative hidden w-full items-center justify-center md:flex md:h-auto md:w-1/2">
        <TimelineImage {...{ content, activeKeyPoint }} />
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
        <div className="relative mt-10 flex h-[50vh] w-full items-center justify-center md:hidden">
          <TimelineImage {...{ content, activeKeyPoint }} />
        </div>
        <p className="my-8 hyphens-auto text-justify font-sans text-2xl font-light leading-normal text-primary-1 md:text-lg">
          {content[activeKeyPoint].description}
        </p>
      </div>
    </div>
  );
}

function TimelineImage({
  content,
  activeKeyPoint,
}: {
  content: TimelineProps[];
  activeKeyPoint: number;
}) {
  return (
    <Image
      priority
      fill
      src={content[activeKeyPoint].image}
      alt={`Image of ${content[activeKeyPoint].title}`}
      className="relative aspect-square rotate-0 scale-105 object-contain transition-transform duration-500 ease-in-out hover:rotate-6 hover:scale-[1.25]"
    />
  );
}
