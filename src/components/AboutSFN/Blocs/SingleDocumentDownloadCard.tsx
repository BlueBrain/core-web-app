'use client';

import { useState } from 'react';
import Link from 'next/link';

import { SingleDocumentProps } from '@/types/about/document-download';
import { classNames } from '@/util/utils';

export default function SingleDocumentDownloadCard({
  content,
  index,
  inView,
  openModal,
}: {
  content: SingleDocumentProps;
  index: number;
  inView: boolean;
  openModal: (singleDocument: SingleDocumentProps) => void;
}) {
  const [onMouseHover, setOnMouseHover] = useState<boolean>(false);

  const handleClick = () => openModal(content);

  return (
    <div
      className={classNames(
        'relative top-0 flex w-full transition-top duration-500 ease-out-back',
        inView ? 'top-0' : 'top-32'
      )}
      style={{ height: '440px', transitionDelay: `${(index + 1) * 150}ms` }}
      onMouseOver={() => setOnMouseHover(true)}
      onFocus={() => setOnMouseHover(true)}
      onMouseOut={() => setOnMouseHover(false)}
      onBlur={() => setOnMouseHover(false)}
    >
      <div
        className="absolute right-0 top-0 h-[470px] w-full shadow-sm"
        // style={cornerStyle}
      />
      <div
        className="relative flex h-full w-full flex-col justify-between overflow-hidden px-6 pb-6 pt-28 shadow-superShadow"
        style={{
          background:
            'radial-gradient(circle at 110% 110%, rgba(77,194,237,1) 0%, rgba(33,36,77,1) 70%)',
        }}
      >
        <div className="relative flex flex-col gap-y-2">
          <h2 className="relative mb-4 break-words text-center text-4xl font-bold uppercase leading-[0.9] tracking-widest md:text-xl xl:text-4xl">
            {content.name}
          </h2>
          <p className="relative text-center font-sans text-base font-light">
            {content.description}
          </p>
        </div>
        <div
          className={classNames(
            'absolute bottom-4 w-[calc(100%-3rem)] transition-bottom duration-700 ease-in-out',
            onMouseHover ? 'bottom-4' : '-bottom-32'
          )}
        >
          {content.access === 'restricted' ? (
            <button
              type="button"
              className="relative mt-4 flex w-full flex-col items-center bg-white py-8 font-sans text-lg uppercase leading-none tracking-wider text-primary-8 md:flex"
              onClick={handleClick}
            >
              <span className="font-bold ">Download Brochure</span>
              <span className="font-light">(PDF)</span>
            </button>
          ) : (
            <Link
              download
              className="relative mt-4 flex w-full flex-col items-center bg-white py-8 font-sans text-lg uppercase leading-none tracking-wider text-primary-8 md:flex"
              target="_blank"
              rel="noopener noreferrer"
              locale={false}
              href={content.url}
            >
              <span className="font-bold ">Download Brochure</span>
              <span className="font-light">(PDF)</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
