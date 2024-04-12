'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useAtom, useAtomValue } from 'jotai';
import { Dispatch, useState, SetStateAction } from 'react';
import { classNames } from '@/util/utils';
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
  selectedScope,
  setSelectedScope,
}: {
  selectedScope: SimulationScope | null;
  setSelectedScope: Dispatch<SetStateAction<SimulationScope | null>>;
}) {
  const projectTopMenuRef = useAtomValue(projectTopMenuRefAtom);

  const controls = (
    <>
      <button
        className={classNames('text-lg', !selectedScope && 'font-bold underline')}
        onClick={() => setSelectedScope(null)}
        type="button"
      >
        All
      </button>
      {(Object.keys(SimulationScope) as Array<SimulationScope>).map((scope) => (
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
    </>
  );
  return projectTopMenuRef?.current && createPortal(controls, projectTopMenuRef.current);
}

const imgBasePath = `/images/virtual-lab/simulate`;

const items = [
  {
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    key: SimulationType.IonChannel,
    scope: 'cellular',
    src: `${imgBasePath}/${SimulationType.IonChannel}.png`,
    title: 'Ion Channel',
  },
  {
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    key: SimulationType.SingleNeuron,
    scope: 'circuit',
    src: `${imgBasePath}/${SimulationType.SingleNeuron}.png`,
    title: 'Single Neuron',
  },
  {
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    key: SimulationType.PairedNeuron,
    scope: 'circuit',
    src: `${imgBasePath}/${SimulationType.PairedNeuron}.png`,
    title: 'Paired Neuron',
  },
  {
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    key: SimulationType.Synaptome,
    scope: 'system',
    src: `${imgBasePath}/${SimulationType.Synaptome}.png`,
    title: 'Synaptome',
  },
];

function ScopeCarousel() {
  const [selectedScope, setSelectedScope] = useState<SimulationScope | null>(null);

  const [selectedSimulationScope, setSelectedSimulationScope] = useAtom(
    selectedSimulationScopeAtom
  );

  return (
    <>
      <ScopeSelector selectedScope={selectedScope} setSelectedScope={setSelectedScope} />
      <div className="flex gap-4">
        {items
          .filter(({ scope }) => !selectedScope || scope === selectedScope)
          .map(({ description, key, src, title }) => (
            <button
              key={key}
              className={classNames(
                'flex flex-col gap-2 text-left text-white',
                !!selectedSimulationScope &&
                  selectedSimulationScope !== key &&
                  'text-opacity-60 opacity-60 hover:text-opacity-100 hover:opacity-100',
                !selectedSimulationScope && 'hover:font-bold'
              )}
              onClick={() =>
                setSelectedSimulationScope(selectedSimulationScope !== key ? key : null)
              }
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
              <div className="relative h-[122px] w-full" style={{ opacity: 'inherit' }}>
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
          ))}
      </div>
    </>
  );
}

export default function VirtualLabProjectSimulatePage() {
  return (
    <div className="flex flex-col gap-10 pt-6">
      <ScopeCarousel />
      <div className="flex flex-col gap-2 bg-white px-4 pt-10">
        <h3 className="text-3xl font-bold text-primary-8">Model library</h3>
        <WithExploreEModel dataType={DataType.CircuitEModel} brainRegionSource="selected" />
      </div>
    </div>
  );
}
