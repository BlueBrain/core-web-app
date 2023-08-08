'use client';

import { useState } from 'react';
import Link from 'next/link';

import { EyeIcon, AddIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import { SingleCard, SubSectionCardItem } from '@/types/explore-section/application';

type SectionCardsProps = {
  content: SingleCard;
  cardIndex: number;
  expanded?: boolean;
};

export default function SectionCards({ content, cardIndex, expanded }: SectionCardsProps) {
  const [sectionStatus, setSectionStatus] = useState<boolean>(false);

  const backgroundColor = cardIndex <= 1 ? 'bg-primary-7' : 'bg-primary-8';

  return content.icon === 'eye' ? (
    <Link
      id="explore-section-card-1"
      href={content.url}
      className={classNames(
        'w-full flex flex-row justify-between items-center transition-padding ease-in-out duration-300 hover:py-12',
        backgroundColor,
        expanded ? 'p-3 hover:py-7' : 'p-8'
      )}
    >
      <div className="flex flex-col justify-start">
        <h2 className={`${expanded ? 'text-lg' : 'text-2xl'} font-bold text-white`}>
          {content.name}
        </h2>
        {!expanded && <p className="text-sm font-light text-blue-200">{content.description}</p>}
      </div>

      {content.icon === 'eye' ? (
        <EyeIcon fill="white" className="w-auto h-3" />
      ) : (
        <AddIcon fill="white" className="w-auto h-4" />
      )}
    </Link>
  ) : (
    <div className="flex flex-col w-full">
      <button
        type="button"
        className={classNames(
          'flex flex-row items-center justify-between transition-padding ease-in-out duration-300 hover:py-12',
          expanded ? 'p-3 hover:py-7' : 'p-8',
          sectionStatus ? 'hover:py-8' : 'hover:py-12',
          backgroundColor
        )}
        onClick={() => setSectionStatus(!sectionStatus)}
      >
        <div className="flex flex-col items-start">
          <h2 className={`${expanded ? 'text-lg' : 'text-2xl'} font-bold text-white`}>
            {content.name}
          </h2>
          {!expanded && <p className="text-sm font-light text-blue-200">{content.description}</p>}
        </div>

        {content.icon === 'eye' ? (
          <EyeIcon fill="white" className="w-auto h-3" />
        ) : (
          <AddIcon
            fill="white"
            className={classNames(
              'w-auto h-4 transition-transform ease-in-out duration-300 origin-center',
              sectionStatus ? 'rotate-45' : 'rotate-0'
            )}
          />
        )}
      </button>
      {sectionStatus && Boolean(content.items?.length) && (
        <div className="flex flex-col justify-start w-full px-8">
          {content.items?.map((subsection: SubSectionCardItem, index: number) => (
            <Link
              href={subsection.url}
              key={`explore-section-card-${subsection.name}`}
              className={classNames(
                'w-full py-4 flex flex-col justify-start leading-tighttransition-padding ease-linear duration-150 hover:py-7',
                index + 1 !== content.items?.length
                  ? 'border-b border-b-primary-7 border-solid'
                  : ''
              )}
            >
              <h3 className={`${expanded ? 'text-lg' : 'text-2xl'} font-bold text-white`}>
                {subsection.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
