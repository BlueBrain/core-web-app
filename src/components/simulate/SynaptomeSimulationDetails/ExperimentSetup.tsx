import { useState } from 'react';
import SimulationConfigurationTab from './SimultationConfigurationTab';
import RecordingTab from './RecordingTab';
import { SimulationPayload } from '@/types/simulation/single-neuron';
import { classNames } from '@/util/utils';

type Props = {
  experimentSetup: SimulationPayload;
};
type TabKeys = 'simulation-configuration' | 'results';
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
];
export default function ExperimentSetup({ experimentSetup }: Props) {
  const [activeTab, setActiveTab] = useState<TabKeys>('simulation-configuration');
  return (
    <div>
      <h1 className="mb-2 mt-6 text-3xl font-bold text-primary-8">Experiment Setup</h1>
      <ul className="flex w-full items-center justify-center">
        {TABS.map(({ key, title }) => (
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
        ))}
      </ul>
      {activeTab === 'simulation-configuration' && (
        <SimulationConfigurationTab simulation={experimentSetup} />
      )}

      {activeTab === 'results' && <RecordingTab recordings={experimentSetup.simulation} />}
    </div>
  );
}
