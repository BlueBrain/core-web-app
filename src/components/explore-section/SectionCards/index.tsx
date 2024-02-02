import Link from 'next/link';
import Image from 'next/image';
import React, { useState, Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import { SubsectionCard } from './SubsectionCard';
import { EyeIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import { SingleCard, SubSectionCardItem } from '@/types/explore-section/application';
import { basePath } from '@/config';

const DOpenCloseIconButton = dynamic(() => import('@/components/IconButton/OpenCloseIconButton'), {
  ssr: false,
});

type SectionCard = {
  content: SingleCard;
  cardIndex: number;
  setCurrentImageBackground: Dispatch<SetStateAction<string>>;
};

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
    <Link
      id={`explore-navigation-${content.url}`}
      href={content.url}
      className={classNames(
        'relative flex h-[calc(25vh-1.4rem)] w-full flex-row items-start justify-between p-8 2xl:p-14',
        backgroundColor
      )}
      onMouseOver={handleMouseOver}
      onMouseOut={() => setMouseOver(false)}
    >
      <div className="flex w-full flex-col justify-start">
        <div
          className={classNames(
            'relative flex h-9 items-start gap-2 transition-top duration-500 ease-in-out 2xl:h-11',
            mouseOver ? '-top-1' : 'top-2'
          )}
        >
          {content.prefixIcon && (
            <div className="relative flex h-full w-6 flex-col items-center justify-center lg:w-7">
              <Image fill alt={content.name} src={`${basePath}/${content.prefixIcon}`} />
            </div>
          )}
          <h2 className="relative text-center text-4xl font-bold text-white 2xl:text-5xl">
            {content.name}
          </h2>
        </div>
        <p
          className={classNames(
            'relative w-2/3 text-sm font-light text-blue-200 transition-all duration-500 ease-in-out 2xl:text-lg',
            mouseOver ? 'top-2 opacity-100' : '-top-6 opacity-0'
          )}
        >
          {content.description}
        </p>
      </div>

      <EyeIcon className="h-3 w-auto text-white 2xl:h-5" />
    </Link>
  ) : (
    <div
      className={classNames(
        'relative flex w-full flex-col items-start justify-start overflow-hidden transition-height duration-500 ease-in-out',
        backgroundColor
      )}
      style={{
        height: sectionStatus
          ? `${!!content.items && (content.items.length + 1.3) * 11}vh`
          : 'h-[calc(25vh-1.4rem)]',
      }}
    >
      <button
        type="button"
        className="relative flex h-15vh w-full flex-row items-center justify-between py-8 pl-8 pr-6 focus:outline-none active:outline-none 2xl:pl-14 2xl:pr-10"
        onClick={() => setSectionStatus(!sectionStatus)}
        onMouseOver={handleMouseOver}
        onFocus={handleMouseOver}
        onMouseOut={() => setMouseOver(false)}
        onBlur={() => setMouseOver(false)}
      >
        <div className="relative flex flex-col items-start text-left">
          {content.prefixIcon && (
            <div className="flex h-full flex-col items-center justify-center">
              <Image
                src={`${basePath}/${content.prefixIcon}`}
                alt={content.name}
                width={21}
                height={21}
              />
            </div>
          )}
          <h2
            className={classNames(
              'relative text-2xl font-bold transition-top duration-500 ease-in-out 2xl:text-4xl',
              mouseOver || sectionStatus ? '-top-1' : 'top-2',
              sectionStatus ? 'text-primary-4' : 'text-white'
            )}
          >
            {content.name}
          </h2>
          <p
            className={classNames(
              'relative text-sm font-light transition-all duration-500 ease-in-out 2xl:text-lg',
              mouseOver || sectionStatus ? '-top-0.5 opacity-100' : '-top-6 opacity-0',
              sectionStatus ? 'text-primary-4' : 'text-blue-200'
            )}
          >
            {content.description}
          </p>
        </div>

        <DOpenCloseIconButton status={sectionStatus} backgroundColor="bg-white" />
      </button>

      {sectionStatus && (
        <div
          className={classNames('w-full flex-col justify-start', sectionStatus ? 'flex' : 'hidden')}
        >
          {!!content.items &&
            content.items.map((subsection: SubSectionCardItem, index: number) => (
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
