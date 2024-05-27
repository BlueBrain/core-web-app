'use client';

import { basePath } from '@/config';
import WithExploreEModel from '@/components/explore-section/EModel/WithExploreEModel';
import ScopeCarousel from '@/components/VirtualLab/ScopeCarousel';
import { DataType } from '@/constants/explore-section/list-views';
import { SimulationType } from '@/types/virtual-lab/lab';

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

export default function VirtualLabProjectBuildPage() {
  return (
    <div className="flex flex-col gap-10 pt-14">
      <ScopeCarousel items={items} />
      <div className="flex flex-col gap-2 bg-white px-4 pt-10">
        <h3 className="text-3xl font-bold text-primary-8">Model library</h3>
        <WithExploreEModel dataType={DataType.CircuitEModel} brainRegionSource="selected" />
      </div>
    </div>
  );
}
