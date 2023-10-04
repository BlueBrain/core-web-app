'use client';

import MainPanel from './MainPanel';
import BottomPanel from './BottomPanel';
import ControlPanel from './ControlPanel';
import ExperimentInteractiveProvider from './ExperimentInteractiveProvider';
import SlotsSelector from './SlotsSelector';
import { useSlotSelectorVisible } from './hooks/slot-selector-visible';
import ViewSettingsPanel from '@/components/experiment-interactive/ExperimentInteractive/ControlPanel/ViewSettingsPanel';

export default function ExperimentInteractive() {
  const [slotSelectorVisible] = useSlotSelectorVisible();
  return (
    <ExperimentInteractiveProvider>
      <div className="w-full flex flex-col bg-black h-screen text-white relative">
        <MainPanel />
        <BottomPanel />
        <ControlPanel />
        <ViewSettingsPanel />
        {slotSelectorVisible && <SlotsSelector />}
      </div>
    </ExperimentInteractiveProvider>
  );
}
