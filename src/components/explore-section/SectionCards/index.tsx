'use client';

import Link from 'next/link';
import { useState } from 'react';
import { EyeIcon, AddIcon } from '@/components/icons';

// TYPE

type SectionCardsProps = {
  content: any;
  cardIndex: number;
  expanded?: boolean;
};

type SubSectionProps = {
  name: string;
  subtitle: string;
  url: string;
};

export default function SectionCards({ content, cardIndex, expanded }: SectionCardsProps) {
  const [sectionStatus, setSectionStatus] = useState<boolean>(false);

  const backgroundColor = cardIndex <= 1 ? 'bg-primary-7' : 'bg-primary-8';

  return content.icon === 'eye' ? (
    <Link
      id="explore-section-card-1"
      href={content.url}
      className={`w-full ${backgroundColor} ${
        expanded ? 'p-3 hover:py-7' : 'p-8'
      } flex flex-row justify-between items-center transition-padding ease-in-out duration-300 hover:py-12`}
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
        className={`w-full ${backgroundColor} ${
          expanded ? 'p-3 hover:py-7' : 'p-8'
        } flex flex-row items-center justify-between transition-padding ease-in-out duration-300 ${
          sectionStatus ? 'hover:py-8' : 'hover:py-12'
        } hover:py-12}`}
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
            className={`w-auto h-4 transition-transform ease-in-out duration-300 origin-center ${
              sectionStatus ? 'rotate-45' : 'rotate-0'
            }`}
          />
        )}
      </button>
      {sectionStatus && (
        <div className="flex flex-col justify-start w-full px-8">
          {content.children.map((subsection: SubSectionProps, index: number) => (
            <Link
              href={subsection.url}
              key={`explore-section-card-${subsection.name}`}
              className={`w-full py-4 flex flex-col justify-start leading-tight ${
                index + 1 !== content.children.length
                  ? 'border-b border-b-primary-7 border-solid'
                  : ''
              } transition-padding ease-linear duration-150 hover:py-7`}
            >
              <h3 className={`${expanded ? 'text-lg' : 'text-2xl'} font-bold text-white`}>
                {subsection.name}
              </h3>
              {!expanded && (
                <div className="text-sm font-light text-blue-200 ">{subsection.subtitle}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
