'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useAtom, useAtomValue } from 'jotai';
import { Dispatch, ReactNode, useRef, useState, SetStateAction } from 'react';
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { CarouselRef } from 'antd/lib/carousel';
import { classNames } from '@/util/utils';
import { basePath } from '@/config';
import WithExploreEModel from '@/components/explore-section/EModel/WithExploreEModel';
import { DataType } from '@/constants/explore-section/list-views';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { projectTopMenuRefAtom } from '@/state/virtual-lab/lab';
import { SimulationType } from '@/types/virtual-lab/lab';

enum SimulationScope {
  Cellular = 'cellular',
  Circuit = 'circuit',
  System = 'system',
}

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

function CustomSlide(props: {
  key: SimulationType;
  description: string;
  src: string;
  title: string;
  selectedSimulationScope: SimulationType | null;
  setSelectedSimulationScope: Dispatch<SetStateAction<SimulationType | null>>;
}) {
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

function ScopeCarousel() {
  const [selectedScope, setSelectedScope] = useState<SimulationScope | null>(null);

  const [selectedSimulationScope, setSelectedSimulationScope] = useAtom(
    selectedSimulationScopeAtom
  );

  const carouselRef = useRef<CarouselRef>(null);
  const progressRef = useRef(null);

  // const [currentSlide, setCurrentSlide] = useState<number>(0);

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

export default function VirtualLabProjectBuildPage() {
  return (
    <div className="flex flex-col gap-10 pt-14">
      <ScopeCarousel />
      <div className="flex flex-col gap-2 bg-white px-4 pt-10">
        <h3 className="text-3xl font-bold text-primary-8">Model library</h3>
        <WithExploreEModel dataType={DataType.CircuitEModel} brainRegionSource="selected" />
      </div>
    </div>
  );
}
