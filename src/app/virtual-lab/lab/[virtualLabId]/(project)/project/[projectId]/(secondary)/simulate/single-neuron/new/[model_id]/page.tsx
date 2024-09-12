'use client';

import { useEffect } from 'react';
import { useResetAtom } from 'jotai/utils';

import SingleNeuronSimulationGenericContainer from '@/components/simulate/single-neuron/containers';
import { resetSimulationAtom } from '@/state/simulate/single-neuron-setter';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

export default function SingleNeuronSimulation({ params: { projectId, virtualLabId } }: Props) {
  const resetSimulation = useResetAtom(resetSimulationAtom);

  useEffect(() => {
    return resetSimulation;
  }, [resetSimulation]);

  return (
    <SingleNeuronSimulationGenericContainer
      {...{
        virtualLabId,
        projectId,
        type: 'single-neuron-simulation',
      }}
    />
  );
}
