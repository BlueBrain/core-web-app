'use client';

import { useState } from 'react';

import BottomPanel from './BottomPanel';
import ControlPanel from './ControlPanel';
import ExperimentInteractiveProvider from './ExperimentInteractiveProvider';
import SlotsSelector from './SlotsSelector';
import { useSlotSelectorVisible } from './hooks/slot-selector-visible';
import SimulationGrid from './SimulationGrid';
import ViewSettingsPanel from '@/components/experiment-interactive/ExperimentInteractive/ControlPanel/ViewSettingsPanel';
import { SimulationReport } from '@/services/brayns/simulations/resource-manager/backend-service';

export default function ExperimentInteractive() {
  const [report, setReport] = useState<SimulationReport | undefined>(undefined);
  const [slotSelectorVisible] = useSlotSelectorVisible();
  return (
    <ExperimentInteractiveProvider>
      <div className="w-full flex flex-col bg-black h-screen text-white relative">
        <SimulationGrid onReportLoaded={setReport} />
        <BottomPanel />
        <ControlPanel />
        <ViewSettingsPanel />
        {slotSelectorVisible && <SlotsSelector />}
      </div>
    </ExperimentInteractiveProvider>
  );
}
