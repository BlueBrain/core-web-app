'use client';

import Image from 'next/image';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { classNames } from '@/util/utils';
import { basePath } from '@/config';
import WithExploreEModel from '@/components/explore-section/EModel/WithExploreEModel';
import { DataType } from '@/constants/explore-section/list-views';
import { selectedSimulationScopeAtom } from '@/state/simulate';

enum SimulationScope {
  cellular = 'cellular',
  circuit = 'circuit',
  system = 'system',
}

enum SimulationType {
  ionChannel = 'ion-channel',
  singleNeuron = 'single-neuron',
  pairedNeuron = 'paired-neuron',
  synaptome = 'synaptome',
}

const imgBasePath = `/${basePath}images/virtual-lab/simulate`;

const items = [
  {
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    key: SimulationType.ionChannel,
    src: `${imgBasePath}/${SimulationType.ionChannel}.png`,
    title: 'Ion Channel',
  },
  {
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    key: SimulationType.singleNeuron,
    src: `${imgBasePath}/${SimulationType.singleNeuron}.png`,
    title: 'Single Neuron',
  },
  {
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    key: SimulationType.pairedNeuron,
    src: `${imgBasePath}/${SimulationType.pairedNeuron}.png`,
    title: 'Paired Neuron',
  },
  {
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    key: SimulationType.synaptome,
    src: `${imgBasePath}/${SimulationType.synaptome}.png`,
    title: 'Synaptome',
  },
];

export default function VirtualLabProjectSimulatePage() {
  const [selectedSimulationScope, setSelectedSimulationScope] = useAtom(
    selectedSimulationScopeAtom
  );

  const [selectedScope, setSelectedScope] = useState('All');

  return (
    <div className="flex flex-col gap-10 pt-6">
      <div className="flex gap-4">
        {['All', SimulationScope.cellular, SimulationScope.circuit, SimulationScope.system].map(
          (scope) => (
            <button
              key={scope}
              className={classNames('text-lg', selectedScope === scope && 'font-bold underline')}
              onClick={() => setSelectedScope(scope)}
              type="button"
            >
              {
                scope.charAt(0).toUpperCase() + scope.slice(1) // Capitalize first letter
              }
            </button>
          )
        )}
      </div>
      <div className="flex gap-4">
        {items.map(({ description, key, src, title }) => (
          <button
            key={key}
            className={classNames(
              'flex flex-col gap-2 text-left text-white',
              !!selectedSimulationScope &&
                selectedSimulationScope !== key &&
                'text-opacity-60 opacity-60 hover:text-opacity-100 hover:opacity-100',
              !selectedSimulationScope && 'hover:font-bold'
            )}
            onClick={() => setSelectedSimulationScope(key)}
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
      <div className="flex flex-col gap-2 bg-white px-4 pt-10">
        <h3 className="text-3xl font-bold text-primary-8">Model library</h3>
        <WithExploreEModel dataType={DataType.CircuitEModel} brainRegionSource="selected" />
      </div>
    </div>
  );
}
