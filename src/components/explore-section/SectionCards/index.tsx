import Link from 'next/link';
import React, { useState, Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import { SubsectionCard } from './SubsectionCard';
import { EyeIcon } from '@/components/icons';
import { classNames } from '@/util/utils';

const DOpenCloseIconButton = dynamic(() => import('@/components/IconButton/OpenCloseIconButton'), {
  ssr: false,
});

// TYPES ---------

type Items = {
  name: string;
  type: string;
  url: string;
};

type Content = {
  name: string;
  description: string;
  url: string;
  icon: string;
  image: string;
  items?: Items[] | null;
};

type SectionCard = {
  content: Content;
  cardIndex: number;
  setCurrentImageBackground: Dispatch<SetStateAction<string>>;
};

//---------------

export default function SectionCards({
  content,
  cardIndex,
  setCurrentImageBackground,
}: SectionCard) {
  const [sectionStatus, setSectionStatus] = useState<boolean>(false);
  const [mouseOver, setMouseOver] = useState<boolean>(false);

  const backgroundColor = cardIndex <= 1 ? 'bg-primary-7' : 'bg-primary-8';

  const handleMouseOver = () => {
    setMouseOver(true);
    setCurrentImageBackground(content.image);
  };

  return content.icon === 'eye' ? (
    // IF LINK
    <Link
      href={content.url}
      className={classNames(
        'relative w-full h-15vh p-8 2xl:p-14 flex flex-row justify-between items-center',
        backgroundColor
      )}
      onMouseOver={handleMouseOver}
      onMouseOut={() => setMouseOver(false)}
    >
      <div className="flex flex-col justify-start">
        <h2
          className={classNames(
            'relative text-2xl 2xl:text-4xl font-bold text-white transition-top ease-in-out duration-500',
            mouseOver ? '-top-1' : 'top-2'
          )}
        >
          {content.name}
        </h2>
        <p
          className={classNames(
            'relative text-sm 2xl:text-lg font-light text-blue-200 transition-all ease-in-out duration-500',
            mouseOver ? 'opacity-100 -top-1' : 'opacity-0 -top-6'
          )}
        >
          {content.description}
        </p>
      </div>

      <EyeIcon fill="white" className="w-auto h-3 2xl:h-5" />
    </Link>
  ) : (
    // IF BUTTON HAS CHILDREN ITEMS
    <div
      className={classNames(
        'relative w-full flex flex-col items-start justify-start transition-height ease-in-out duration-500 overflow-hidden',
        backgroundColor
      )}
      style={{
        height: sectionStatus
          ? `${!!content.items && (content.items.length + 1.3) * 11}vh`
          : '15vh',
      }}
    >
      <button
        type="button"
        className="relative w-full h-15vh py-8 pl-8 pr-6 2xl:pl-14 2xl:pr-10 flex flex-row justify-between items-center active:outline-none focus:outline-none"
        onClick={() => setSectionStatus(!sectionStatus)}
        onMouseOver={handleMouseOver}
        onFocus={handleMouseOver}
        onMouseOut={() => setMouseOver(false)}
        onBlur={() => setMouseOver(false)}
      >
        <div className="relative flex flex-col items-start text-left">
          <h2
            className={classNames(
              'relative text-2xl 2xl:text-4xl font-bold transition-top ease-in-out duration-500',
              mouseOver || sectionStatus ? '-top-1' : 'top-2',
              sectionStatus ? 'text-primary-4' : 'text-white'
            )}
          >
            {content.name}
          </h2>
          <p
            className={classNames(
              'relative transition-all ease-in-out duration-500 text-sm 2xl:text-lg font-light',
              mouseOver || sectionStatus ? 'opacity-100 -top-0.5' : 'opacity-0 -top-6',
              sectionStatus ? 'text-primary-4' : 'text-blue-200'
            )}
          >
            {content.description}
          </p>
        </div>

        <DOpenCloseIconButton status={sectionStatus} backgroundColor="bg-white" />
      </button>

      {/* ITEMS SECTION */}
      {sectionStatus && (
        <div
          className={classNames('w-full flex-col justify-start', sectionStatus ? 'flex' : 'hidden')}
        >
          {!!content.items &&
            content.items.map((subsection: Items, index: number) => (
              <SubsectionCard
                subsection={subsection}
                cardIndex={index}
                key={`explore-section-card-${subsection.name}`}
              />
            ))}
        </div>
      )}
    </div>
  );
}
