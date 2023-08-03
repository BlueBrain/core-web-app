'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { sectionContent } from '@/constants/homes-sections/homeSectionContent';
import { basePath } from '@/config';

import SectionCards from '@/components/explore-section/SectionCards';
import HomeHeader from '@/components/Global/HomeHeader';
import { classNames } from '@/util/utils';

// TYPES ---------

type Items = {
  name: string;
  type: string;
  url: string;
};

type SingleCard = {
  name: string;
  description: string;
  url: string;
  icon: string;
  image: string;
  items?: Items[] | null;
};

//---------------

export default function Explore() {
  const content = sectionContent;

  const [currentImageBackground, setCurrentImageBackground] = useState<string>(
    '/images/explore/explore_home_bgImg-01.jpg'
  );

  return (
    <div className="relative w-screen min-h-screen flex flex-row-reverse justify-start flex-nowrap bg-primary-9">
      <HomeHeader
        title="Explore"
        description="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
      />

      <div className="relative z-10 w-2/3 flex flex-col p-8 gap-y-1">
        {content.map((singleCard: SingleCard, index: number) => (
          <SectionCards
            content={singleCard}
            cardIndex={index}
            setCurrentImageBackground={setCurrentImageBackground}
            key={`explore-section-card-${singleCard.name}`}
          />
        ))}
      </div>

      <div className="w-screen max-w-screen h-screen fixed bottom-0 left-0 z-0">
        {content.map((singleImage: SingleCard) => (
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
