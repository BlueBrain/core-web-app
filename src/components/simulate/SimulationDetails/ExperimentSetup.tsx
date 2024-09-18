import { useState } from 'react';

import SimulationConfigurationTab from './SimultationConfigurationTab';
import AnalysisTab from './AnalysisTab';
import ResultsTab from './RecordingTab';

import { SimulationPayload } from '@/types/simulation/single-neuron';
import { classNames } from '@/util/utils';
import { NexusMEModel } from '@/types/me-model';

type TabKeys = 'simulation-configuration' | 'results' | 'analysis';

type Tab = { key: TabKeys; title: string };

const TABS: Tab[] = [
  {
    key: 'simulation-configuration',
    title: 'Simulation configuration',
  },
  {
    key: 'results',
    title: 'Results',
  },
  {
    key: 'analysis',
    title: 'Analysis',
  },
];

type Props = {
  experimentSetup: SimulationPayload;
  type: 'single-neuron-simulation' | 'synaptome-simulation';
  meModel: NexusMEModel | null;
};

export default function ExperimentSetupTab({ experimentSetup, type, meModel }: Props) {
  const [activeTab, setActiveTab] = useState<TabKeys>('simulation-configuration');
  return (
    <div>
      <h1 className="mb-3 mt-6 text-3xl font-bold text-primary-8">Experiment Setup</h1>
      <ul className="flex w-full items-center justify-center">
        {(type === 'synaptome-simulation' ? TABS.filter((p) => p.key !== 'analysis') : TABS).map(
          ({ key, title }) => (
            <li
              title={title}
              key={key}
              className={classNames(
                'w-1/3 flex-[1_1_33%] border py-3 text-center text-xl font-semibold transition-all duration-200 ease-out',
                activeTab === key ? 'bg-primary-9 text-white' : 'bg-white text-primary-9'
              )}
            >
              <button
                type="button"
                className="w-full"
                onClick={() => setActiveTab(key)}
                onKeyDown={() => setActiveTab(key)}
              >
                {title}
              </button>
            </li>
          )
        )}
      </ul>
      {activeTab === 'simulation-configuration' && (
        <SimulationConfigurationTab type={type} simulation={experimentSetup} />
      )}

      {activeTab === 'results' && <ResultsTab recordings={experimentSetup.simulation} />}
      {activeTab === 'analysis' && type === 'single-neuron-simulation' && (
        <AnalysisTab meModel={meModel} />
      )}
    </div>
  );
}
