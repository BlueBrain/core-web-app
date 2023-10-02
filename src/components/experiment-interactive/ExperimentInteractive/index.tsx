'use client';

import MainPanel from './MainPanel';
import BottomPanel from './BottomPanel';
import ControlPanel from './ControlPanel';
import ExperimentInteractiveProvider from './ExperimentInteractiveProvider';
import { useSimulationSlots } from './hooks';
import SlotsSelector from './SlotsSelector';
import ViewSettingsPanel from '@/components/experiment-interactive/ExperimentInteractive/ControlPanel/ViewSettingsPanel';

export default function ExperimentInteractive() {
  const simulationSlots = useSimulationSlots();
  return (
    <ExperimentInteractiveProvider>
      <div className="w-full flex flex-col bg-black h-screen text-white relative">
        {simulationSlots.list.length === 0 ? (
          <SlotsSelector />
        ) : (
          <>
            <MainPanel />
            <BottomPanel />
            <ControlPanel />
            <ViewSettingsPanel />
          </>
        )}
      </div>
    </ExperimentInteractiveProvider>
  );
}
