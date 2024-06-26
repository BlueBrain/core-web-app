'use client';

import { ConfigProvider, theme } from 'antd';
import BottomPanel from './BottomPanel';
import ControlPanel from './ControlPanel';
import ExperimentInteractiveProvider from './ExperimentInteractiveProvider';
import SlotsSelector from './SlotsSelector';
import { useSlotSelectorVisible } from './hooks/slot-selector-visible';
import SimulationGrid from './SimulationGrid';
import ViewSettingsPanel from '@/components/experiment-interactive/ExperimentInteractive/ControlPanel/ViewSettingsPanel';

export default function ExperimentInteractive() {
  const [slotSelectorVisible] = useSlotSelectorVisible();
  return (
    <ExperimentInteractiveProvider>
      <div className="relative flex h-screen w-full flex-col bg-black text-white">
        <SimulationGrid />
        <BottomPanel />
        <ControlPanel />
        <ViewSettingsPanel />
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          {slotSelectorVisible && <SlotsSelector />}
        </ConfigProvider>
      </div>
    </ExperimentInteractiveProvider>
  );
}
