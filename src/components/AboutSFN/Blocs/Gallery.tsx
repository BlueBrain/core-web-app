'use client';

import { useState } from 'react';

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
}: {
  title: string;
  subtitle: string;
  content: GalleryContentProps[];
}) {
  const [currentActiveItem, setCurrentActiveItem] = useState<number>(0);

  const handleItemSelection = (selection: number) => {
    setCurrentActiveItem(selection);
  };

  return (
    <div className="relative flex w-full flex-col" id={slugify(title)}>
      <header className="mb-12 flex flex-col uppercase leading-[0.92] tracking-wider">
        <h2 className="text-[100px] font-bold">{title}</h2>
        <h3 className="text-3xl uppercase text-primary-3">{subtitle}</h3>
      </header>
      <SingleGalleryItem
        title={content[currentActiveItem].title}
        paragraph={content[currentActiveItem].description}
        image={content[currentActiveItem].image}
      />
      <div className="relative mt-10 grid w-full grid-cols-5 gap-y-6">
        {content.map((item: GalleryContentProps, index: number) => (
          <button
            type="button"
            onClick={() => handleItemSelection(index)}
            key={`item-${item.title}`}
            className="flex h-12 flex-col bg-primary-9 font-sans font-light"
          >
            <div className="text-primary-4">{index + 1}</div>
            <h5 className="text-lg font-semibold text-white">{item.title}</h5>
          </button>
        ))}
      </div>
    </div>
  );
}
