'use client';

import { useState } from 'react';

import downloadFileByHref from '@/util/downloadFileByHref';
import { SingleDocumentProps } from '@/types/about/document-download';
import { classNames } from '@/util/utils';
import { basePath } from '@/config';

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

  const handleClick = () => {
    if (content.access === 'restricted') {
      openModal(content);
    } else {
      downloadFileByHref(`${basePath}${content.url}`, content.name);
    }
  };

  const cardHeight = 440;

  const cardStyle = {
    clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 19%, 72% 0)',
    background: 'radial-gradient(circle at 110% 110%, rgba(77,194,237,1) 0%, rgba(33,36,77,1) 70%)',
    height: `${cardHeight}px`,
  };

  const cornerStyle = {
    clipPath: 'polygon(80% 0, 80% 18%, 100% 18%)',
    background: 'linear-gradient(50deg, rgba(77,194,237,1) 80%, rgba(33,36,77,1) 100%)',
  };

  return (
    <div
      className={classNames(
        'relative top-0 flex w-full transition-top duration-500 ease-out-back',
        inView ? 'top-0' : 'top-32'
      )}
      style={{ height: `${cardHeight}px`, transitionDelay: `${(index + 1) * 150}ms` }}
    >
      <div
        className="absolute right-0 top-0 z-50 h-[470px] w-[430px] shadow-[-8px_8px_22px_0_rgba(0,0,0,0.8)]"
        style={cornerStyle}
      />
      <div
        className="relative z-20 flex w-full flex-col justify-between overflow-hidden px-6 pb-6 pt-28 shadow-superShadow"
        style={cardStyle}
        onMouseOver={() => setOnMouseHover(true)}
        onFocus={() => setOnMouseHover(true)}
        onMouseOut={() => setOnMouseHover(false)}
        onBlur={() => setOnMouseHover(false)}
      >
        <div
          className={classNames(
            'relative flex flex-col gap-y-2  transition-top duration-500 ease-in-out',
            onMouseHover ? 'top-3' : 'top-10'
          )}
        >
          <h2 className="relative text-center text-4xl font-bold uppercase leading-[0.9] tracking-widest">
            {content.name}
          </h2>
          <p className="relative text-center font-sans text-base font-light">
            {content.description}
          </p>
        </div>

        {/* Button DESKTOP */}
        {/* Made to avoid using a library especially for this component */}
        <button
          type="button"
          className={classNames(
            'relative mt-4 hidden w-full flex-col items-center bg-white py-8 font-sans text-lg uppercase leading-none tracking-wider text-primary-8 transition-top duration-700 ease-in-out md:flex',
            onMouseHover ? 'top-0' : 'top-32'
          )}
          onClick={handleClick}
        >
          <span className="font-bold ">Download Brochure</span>
          <span className="font-light">(PDF)</span>
        </button>

        {/* Button MOBILE */}
        {/* Made to avoid using a library especially for this component */}
        <button
          type="button"
          className="relative mt-4 flex w-full flex-col items-center bg-white py-8 font-sans text-lg uppercase leading-none tracking-wider text-primary-8 transition-top duration-700 ease-in-out md:hidden"
          onClick={handleClick}
        >
          <span className="font-bold ">Download Brochure</span>
          <span className="font-light">(PDF)</span>
        </button>
      </div>
    </div>
  );
}
