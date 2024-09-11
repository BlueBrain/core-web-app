'use client';

import { useResetAtom } from 'jotai/utils';
import { useEffect } from 'react';
import { resetSimulationAtom } from '@/state/simulate/single-neuron-setter';
import SingleNeuronSimulationGenericContainer from '@/components/simulate/single-neuron/containers';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

export default function SynaptomeSimulation({ params: { projectId, virtualLabId } }: Props) {
  const resetSimulation = useResetAtom(resetSimulationAtom);

  useEffect(() => {
    return resetSimulation;
  }, [resetSimulation]);

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
