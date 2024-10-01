'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import SingleGalleryItem from './SingleGalleryItem';

import slugify from '@/util/slugify';

export type GalleryContentProps = {
  title: string;
  description: string;
  image: string;
};

export default function Gallery({
  title,
  subtitle,
  content,
  setActiveSection,
  id,
}: {
  title: string;
  subtitle: string;
  content: GalleryContentProps[];
  setActiveSection: (section: string) => void;
  id: string;
}) {
  const [currentActiveItem, setCurrentActiveItem] = useState<number>(0);

  const handleItemSelection = (selection: number) => {
    setCurrentActiveItem(selection);
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
      className="relative flex w-full flex-col py-[14vh] md:min-h-screen md:snap-start md:px-[16vw]"
      id={slugify(id)}
      ref={ref}
    >
      <header className="mb-4 flex flex-col px-8 uppercase tracking-[0.1em] md:mb-12 md:px-0">
        <h2 className="mb-4 text-5xl font-bold leading-[0.86] md:text-6xl xl:text-8xl">{title}</h2>
        <h3 className="text-xl font-normal uppercase text-primary-3 md:text-3xl">{subtitle}</h3>
      </header>
      <SingleGalleryItem
        title={content[currentActiveItem].title}
        paragraph={content[currentActiveItem].description}
        image={content[currentActiveItem].image}
      />
      <div className="relative mt-10 w-full px-8 md:mt-0 xl:mt-10 ">
        <div className="grid w-full grid-cols-3  gap-8 md:grid-cols-4 xl:grid-cols-5">
          {content.map((item: GalleryContentProps, index: number) => (
            <button
              type="button"
              onClick={() => handleItemSelection(index)}
              key={`item-${item.title}`}
              className="flex h-12 flex-col items-start bg-primary-9 font-sans font-light"
            >
              <div className="text-primary-4">{index + 1}</div>
              <h5 className="text-lg font-semibold text-white">{item.title}</h5>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
