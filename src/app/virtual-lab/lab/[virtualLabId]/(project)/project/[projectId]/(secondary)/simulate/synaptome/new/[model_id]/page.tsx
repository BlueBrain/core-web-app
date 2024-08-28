'use client';

import SingleNeuronSimulationGenericContainer from '@/components/simulate/single-neuron/containers';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

export default function SynaptomeSimulation({ params: { projectId, virtualLabId } }: Props) {
  return (
    <SingleNeuronSimulationGenericContainer
      {...{
        virtualLabId,
        projectId,
        type: 'synaptome-simulation',
      }}
    />
  );
}
