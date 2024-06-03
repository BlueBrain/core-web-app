import Image from 'next/image';
import { Dispatch, ReactNode, useRef, useState, SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import { useAtom, useAtomValue } from 'jotai';
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { CarouselRef } from 'antd/lib/carousel';

import { basePath } from '@/config';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { projectTopMenuRefAtom } from '@/state/virtual-lab/lab';
import { SimulationType } from '@/types/virtual-lab/lab';
import { classNames } from '@/util/utils';
import hoverStyles from './hover-styles.module.css';

enum SimulationScope {
  Cellular = 'cellular',
  Circuit = 'circuit',
  System = 'system',
}

type SlideProps = {
  className?: string;
  description: string;
  id: SimulationType;
  selectedSimulationScope: SimulationType | null;
  setSelectedSimulationScope: Dispatch<SetStateAction<SimulationType | null>>;
  src: string;
  title: string;
};

const imgBasePath = `${basePath}/images/virtual-lab/simulate`;

const items = [
  {
    description: 'Coming soon.',
    key: SimulationType.IonChannel,
    scope: 'cellular',
    src: `${imgBasePath}/${SimulationType.IonChannel}.png`,
    title: 'Ion Channel',
  },
  {
    description:
      'Load Hodgkin-Huxley single cell models, perform current clamp experiments with different levels of input current, and observe the resulting changes in membrane potential.',
    key: SimulationType.SingleNeuron,
    scope: 'cellular',
    src: `${imgBasePath}/${SimulationType.SingleNeuron}.png`,
    title: 'Single Neuron',
  },
  {
    description:
      'Retrieve interconnected Hodgkin-Huxley cell models from a circuit and conduct a simulated experiment by establishing a stimulation and reporting protocol.',
    key: SimulationType.PairedNeuron,
    scope: 'cellular',
    src: `${imgBasePath}/${SimulationType.PairedNeuron}.png`,
    title: 'Paired Neurons',
  },
  {
    description:
      'Introduce spikes into the synapses of Hodgkin-Huxley cell models and carry out a virtual experiment by setting up a stimulation and reporting protocol.',
    key: SimulationType.Synaptome,
    scope: 'circuit',
    src: `${imgBasePath}/${SimulationType.Synaptome}.png`,
    title: 'Synaptome',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.Microcircuit,
    scope: 'circuit',
    src: `${imgBasePath}/${SimulationType.Microcircuit}.png`,
    title: 'Microcircuit',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.NeuroGliaVasculature,
    scope: 'circuit',
    src: `${imgBasePath}/${SimulationType.NeuroGliaVasculature}.png`,
    title: 'Neuro-glia-vasculature',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.BrainRegions,
    scope: 'system',
    src: `${imgBasePath}/${SimulationType.BrainRegions}.png`,
    title: 'Brain Regions',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.BrainSystems,
    scope: 'system',
    src: `${imgBasePath}/${SimulationType.BrainSystems}.png`,
    title: 'Brain Systems',
  },
  {
    description: 'Coming soon.',
    key: SimulationType.WholeBrain,
    scope: 'system',
    src: `${imgBasePath}/${SimulationType.WholeBrain}.png`,
    title: 'Whole Brain',
  },
];

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

function CustomSlide(props: SlideProps) {
  const {
    className,
    description,
    id: key,
    selectedSimulationScope,
    setSelectedSimulationScope,
    src,
    title,
    ...otherProps // These come from AntD's Carousel component. Do not remove.
  } = props;

  const isSelected = selectedSimulationScope === key; // This particular scope is selected.

  const anyScopeIsSelected = !!selectedSimulationScope;
  const anotherScopeIsSelected = anyScopeIsSelected && selectedSimulationScope !== key; // A scope is selected, but it isn't this one.

  return (
    <button
      className={classNames(
        '!flex h-[290px] w-full flex-col gap-2 overflow-hidden px-3 text-left text-white',
        isSelected && hoverStyles.isSelected,
        anotherScopeIsSelected && hoverStyles.isNotSelected,
        className
      )}
      onClick={() => setSelectedSimulationScope(selectedSimulationScope !== key ? key : null)}
      type="button"
      {...otherProps} // eslint-disable-line react/jsx-props-no-spreading
    >
      <h2 className="text-3xl">{title}</h2>
      <span className="font-light">{description}</span>
      <div className="relative mt-auto h-[168px] w-full">
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

export default function ScopeCarousel() {
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
        className={hoverStyles.customSlide}
        description={description}
        id={key}
        key={key}
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
          className={classNames('-mx-3', hoverStyles.customSlickSlider)}
          dots={false}
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
