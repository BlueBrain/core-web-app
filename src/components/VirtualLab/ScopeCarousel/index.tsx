import Image from 'next/image';
import { Dispatch, ReactNode, useRef, useState, SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import { useAtom, useAtomValue } from 'jotai';
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { CarouselRef } from 'antd/lib/carousel';

import { selectedSimulationScopeAtom } from '@/state/simulate';
import { projectTopMenuRefAtom } from '@/state/virtual-lab/lab';
import { SimulationType } from '@/types/virtual-lab/lab';
import { classNames } from '@/util/utils';

enum SimulationScope {
  Cellular = 'cellular',
  Circuit = 'circuit',
  System = 'system',
}

type SlideProps = {
  description: string;
  key: SimulationType;
  scope: string;
  src: string;
  title: string;
};

function ScopeSelector({
  children,
  selectedScope,
  setSelectedScope,
}: {
  children: ReactNode;
  selectedScope: SimulationScope | null;
  setSelectedScope: Dispatch<SetStateAction<SimulationScope | null>>;
}) {
  const projectTopMenuRef = useAtomValue(projectTopMenuRefAtom);

  const controls = (
    <div className="flex items-center justify-between gap-28">
      <div className="flex gap-2">
        <button
          className={classNames('text-lg', !selectedScope && 'font-bold underline')}
          onClick={() => setSelectedScope(null)}
          type="button"
        >
          All
        </button>
        {(Object.values(SimulationScope) as Array<SimulationScope>).map((scope) => (
          <button
            key={scope}
            className={classNames(
              'text-lg capitalize',
              selectedScope === scope && 'font-bold underline'
            )}
            onClick={() => setSelectedScope(scope)}
            type="button"
          >
            {scope}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">{children}</div>
    </div>
  );
  return projectTopMenuRef?.current && createPortal(controls, projectTopMenuRef.current);
}

function CustomSlide(
  props: Omit<SlideProps, 'scope' | 'key'> & {
    id: SimulationType;
    selectedSimulationScope: SimulationType | null;
    setSelectedSimulationScope: Dispatch<SetStateAction<SimulationType | null>>;
  }
) {
  const {
    description,
    id: key,
    selectedSimulationScope,
    setSelectedSimulationScope,
    src,
    title,
    ...otherProps // These come from AntD's Carousel component. Do not remove.
  } = props;

  return (
    <button
      className={classNames(
        '!flex h-[290px] w-full flex-col gap-2 overflow-hidden px-3 text-left text-white',
        !!selectedSimulationScope &&
          selectedSimulationScope !== key &&
          'text-opacity-60 opacity-60 hover:text-opacity-100 hover:opacity-100',
        !selectedSimulationScope && 'hover:font-bold'
      )}
      onClick={() => setSelectedSimulationScope(selectedSimulationScope !== key ? key : null)}
      type="button"
      {...otherProps} // eslint-disable-line react/jsx-props-no-spreading
    >
      <h2
        className={classNames(
          'text-3xl',
          !!selectedSimulationScope && selectedSimulationScope === key && 'font-bold'
        )}
      >
        {title}
      </h2>
      <span className="font-light">{description}</span>
      <div className="relative mt-auto h-[168px]" style={{ opacity: 'inherit' }}>
        <Image
          fill
          alt={`${title} Banner Image`}
          style={{
            objectFit: 'cover',
          }}
          src={src}
        />
      </div>
    </button>
  );
}

export default function ScopeCarousel({ items }: { items: Array<SlideProps> }) {
  const [selectedScope, setSelectedScope] = useState<SimulationScope | null>(null);

  const [selectedSimulationScope, setSelectedSimulationScope] = useAtom(
    selectedSimulationScopeAtom
  );

  const carouselRef = useRef<CarouselRef>(null);
  const progressRef = useRef(null);

  const slidesToShow = 4;
  const slidesToScroll = 4;

  const carouselItems = items
    .filter(({ scope }) => !selectedScope || scope === selectedScope)
    .map(({ description, key, src, title }) => (
      <CustomSlide
        key={key}
        description={description}
        id={key}
        selectedSimulationScope={selectedSimulationScope}
        setSelectedSimulationScope={setSelectedSimulationScope}
        src={src}
        title={title}
      />
    ));

  return (
    <>
      <ScopeSelector selectedScope={selectedScope} setSelectedScope={setSelectedScope}>
        <LeftOutlined onClick={() => carouselRef.current?.prev()}>Navigate scope left</LeftOutlined>
        <div ref={progressRef} />
        <RightOutlined onClick={() => carouselRef.current?.next()}>
          Navigate scope right
        </RightOutlined>
      </ScopeSelector>
      <div className="relative">
        <Carousel
          arrows
          className="-mx-3"
          dots
          infinite={false}
          ref={carouselRef}
          responsive={[
            {
              breakpoint: 1280,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
              },
            },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
              },
            },
          ]}
          slidesToScroll={slidesToScroll}
          slidesToShow={slidesToShow}
        >
          {carouselItems}
        </Carousel>
        <div className="absolute right-0 top-0 h-full w-[134px] bg-gradient-to-r from-transparent to-[#002766]" />
      </div>
    </>
  );
}
