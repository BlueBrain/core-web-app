'use client';

import ParameterView from '../steps';
import Wrapper from '@/components/simulate/single-neuron/molecules/Wrapper';
import NeuronViewerContainer from '@/components/neuron-viewer/NeuronViewerWithActions';
import { SimulationType } from '@/types/simulation/common';

type Props = {
  meModelUrl: string;
  type: SimulationType;
};

export default function SimulationConfiguration({ meModelUrl, type }: Props) {
  return (
    <Wrapper
      viewer={<NeuronViewerContainer modelUrl={meModelUrl} zoomPlacement="right" />}
      type={type}
    >
      <ParameterView meModelSelf={meModelUrl} type={type} />
    </Wrapper>
  );
}
