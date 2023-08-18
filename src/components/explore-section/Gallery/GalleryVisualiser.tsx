'use client';

import Image from 'next/image';
import { useState } from 'react';
import Navigation from './Navigation';
import {
  SingleGalleryContentType,
  GalleryImagesType,
} from '@/constants/explore-section/gallery-content';
import { classNames } from '@/util/utils';

export default function GalleryVisualliser({ content }: { content: SingleGalleryContentType }) {
  const [currentActiveImage, setCurrentActiveImage] = useState<number>(0);

  const handleGalleryNavigation = (direction: string) => {
    if (direction === 'previous' && currentActiveImage === 0) {
      setCurrentActiveImage(content.images.length - 1);
    } else if (direction === 'previous') {
      setCurrentActiveImage(currentActiveImage - 1);
    } else if (direction === 'next' && currentActiveImage === content.images.length - 1) {
      setCurrentActiveImage(0);
    } else {
      setCurrentActiveImage(currentActiveImage + 1);
    }
  };

  return (
    <div className="relative left-1/4 w-3/4 h-screen flex flex-col justify-between p-6 gap-y-4">
      <div className="w-full overflow-hidden border border-neutral-5 border-solid flex items-center justify-center">
        <Image
          src={content.images[currentActiveImage].src}
          alt={content.images[currentActiveImage].alt}
          width={1200}
          height={800}
          className="w-auto h-full"
          priority
        />
      </div>

      {/* Visualizer */}
      <div className="w-full grid grid-cols-12 gap-2">
        {content.images.map((singleImage: GalleryImagesType, index: number) => (
          <button
            type="button"
            key={`gallery-visualizer-${singleImage.name}`}
            onClick={() => setCurrentActiveImage(index)}
            className={classNames(
              'justify-self-stretch self-stretch overflow-hidden border-solid transition-opacity duration-300 ease-linear hover:opacity-100',
              currentActiveImage === index
                ? 'border-2 border-white opacity-100'
                : 'border border-neutral-7 opacity-70'
            )}
          >
            <Image
              src={singleImage.src}
              alt={singleImage.alt}
              width={800}
              height={800}
              className="w-full h-auto"
            />
          </button>
        ))}
      </div>

      <Navigation
        currentImageContent={content.images[currentActiveImage]}
        navigate={handleGalleryNavigation}
        totalImages={content.images.length}
        currentImage={currentActiveImage}
      />
    </div>
  );
}
