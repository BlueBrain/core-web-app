import { Divider } from 'antd';

import ExamplarMorphology from './ExamplarMorphology';
import ExperimentalTraces from './ExperimentalTraces';
import FeatureSelectionContainer from './FeatureSelectionContainer';
import Mechanism from './Mechanism';
import SimulationParameters from './SimulationParameters';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';

export default function EModelView() {
  return (
    <div className="h-[90vh] overflow-auto p-6">
      <div className="text-3xl font-bold text-primary-8">cNAC_1234_2023</div>
      <Divider />

      <DefaultLoadingSuspense>
        <SimulationParameters />
      </DefaultLoadingSuspense>

      <Divider />

      <DefaultLoadingSuspense>
        <ExamplarMorphology />
      </DefaultLoadingSuspense>

      <Divider />

      <DefaultLoadingSuspense>
        <ExperimentalTraces />
      </DefaultLoadingSuspense>

      <Divider />

      <DefaultLoadingSuspense>
        <FeatureSelectionContainer />
      </DefaultLoadingSuspense>

      <Divider />

      <Mechanism />
    </div>
  );
}
