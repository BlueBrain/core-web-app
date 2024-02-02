'use client';

import { useSlotSelectorVisible } from '../hooks/slot-selector-visible';
import ControlPanelButton from './ControlPanelButton';
import { EyeIcon, PlusIcon } from '@/components/icons';
import { useExperimentInteractive } from '@/components/experiment-interactive/ExperimentInteractive/hooks';

export default function ControlPanel() {
  const [, setSlotSelectorVisible] = useSlotSelectorVisible();
  const addNewSimulation = () => {
    setSlotSelectorVisible(true);
  };
  const { showViewSettingsPanel } = useExperimentInteractive();

  return (
    <div className="absolute right-0 top-0 m-3 inline-flex h-32 w-9 flex-col items-start justify-start gap-1">
      <ControlPanelButton onClick={showViewSettingsPanel}>
        <EyeIcon />
      </ControlPanelButton>
      <ControlPanelButton onClick={addNewSimulation}>
        <PlusIcon />
      </ControlPanelButton>
    </div>
  );
}
