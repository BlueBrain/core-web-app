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
  props: Omit<SlideProps, 'scope'> & {
    selectedSimulationScope: SimulationType | null;
    setSelectedSimulationScope: Dispatch<SetStateAction<SimulationType | null>>;
  }
) {
  const {
    selectedSimulationScope,
    setSelectedSimulationScope,
    description,
    key,
    title,
    src,
    ...otherProps // These come from AntD's Carousel component. Do not remove.
  } = props;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div {...otherProps}>
      <button
        className={classNames(
          'flex h-[280px] w-[286px] flex-col gap-2 text-left text-white',
          !!selectedSimulationScope &&
            selectedSimulationScope !== key &&
            'text-opacity-60 opacity-60 hover:text-opacity-100 hover:opacity-100',
          !selectedSimulationScope && 'hover:font-bold'
        )}
        onClick={() => setSelectedSimulationScope(selectedSimulationScope !== key ? key : null)}
        type="button"
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
        <div className="relative w-full grow" style={{ opacity: 'inherit' }}>
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
    </div>
  );
}

export default function ScopeCarousel({ items }: { items: Array<SlideProps> }) {
  const [selectedScope, setSelectedScope] = useState<SimulationScope | null>(null);

  const [selectedSimulationScope, setSelectedSimulationScope] = useAtom(
    selectedSimulationScopeAtom
  );

  const carouselRef = useRef<CarouselRef>(null);
  const progressRef = useRef(null);

  const slidesToShow = 5;
  const slidesToScroll = 3;

  const carouselItems = items
    .filter(({ scope }) => !selectedScope || scope === selectedScope)
    .map(({ description, key, src, title }) => (
      <CustomSlide
        key={key}
        description={description}
        src={src}
        title={title}
        selectedSimulationScope={selectedSimulationScope}
        setSelectedSimulationScope={setSelectedSimulationScope}
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
      <div>
        <Carousel
          ref={carouselRef}
          arrows
          dots
          infinite={false}
          slidesToShow={slidesToShow}
          slidesToScroll={slidesToScroll}
        >
          {carouselItems}
        </Carousel>
      </div>
    </>
  );
}
