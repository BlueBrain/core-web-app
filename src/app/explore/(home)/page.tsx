'use client';

import { sectionContent } from '@/constants/homes-sections/homeSectionContent';
import type { TypeSingleCard } from '@/constants/homes-sections/homeSectionContent';
import SectionCards from '@/components/explore-section/SectionCards';
import HomeHeader from '@/components/Global/HomeHeader';

export default function Explore() {
  const content = sectionContent;

  return (
    <div className="relative w-screen max-w-screen overflow-x-hidden h-screen flex flex-row-reverse flex-nowrap bg-primary-9">
      <HomeHeader
        title="Explore"
        description="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
      />

      <div className="relative w-2/3 h-full flex flex-col gap-y-3 p-8">
        {content.map((singleCard: TypeSingleCard, index: number) => (
          <SectionCards
            content={singleCard}
            cardIndex={index}
            key={`explore-section-card-${singleCard.name}`}
          />
        ))}
      </div>
    </div>
  );
}
