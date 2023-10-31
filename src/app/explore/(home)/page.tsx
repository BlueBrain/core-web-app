'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { sectionContent } from '@/constants/home-sections/homeSectionContent';
import { basePath } from '@/config';

import SectionCards from '@/components/explore-section/SectionCards';
import HomeHeader from '@/components/Global/HomeHeader';
import { classNames } from '@/util/utils';
import { SingleCard } from '@/types/explore-section/application';

export default function Explore() {
  const [currentImageBackground, setCurrentImageBackground] = useState<string>(
    '/images/explore/explore_home_bgImg-01.jpg'
  );

  return (
    <div className="relative flex flex-row-reverse justify-start w-screen min-h-screen flex-nowrap bg-primary-9">
      <HomeHeader
        title="Explore"
        description="Explore a large collection of neuronal models, virtual simulations, and brain cell distributions in a 3D and interactive manner."
      />

      <div className="relative z-10 flex flex-col w-2/3 h-full p-8 gap-y-2">
        {sectionContent.map((singleCard: SingleCard, index: number) => (
          <SectionCards
            content={singleCard}
            cardIndex={index}
            setCurrentImageBackground={setCurrentImageBackground}
            key={`explore-section-card-${singleCard.name}`}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 z-0 w-screen h-screen max-w-screen">
        {sectionContent.map((singleImage: SingleCard) => (
          <Image
            src={`${basePath}/${singleImage.image}`}
            width={1920}
            height={1080}
            alt="Explore background image"
            className={classNames(
              'absolute bottom-0 left-0 w-full h-auto object-contain transition-opacity duration-1000 ease-in-out',
              singleImage.image === currentImageBackground ? 'opacity-80' : 'opacity-0'
            )}
            key={`explore-image-background_${singleImage.name}`}
          />
        ))}
      </div>
    </div>
  );
}
