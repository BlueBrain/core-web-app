'use client';

import { useSlotSelectorVisible } from '../hooks/slot-selector-visible';
import ControlPanelButton from './ControlPanelButton';
import { EyeIcon, PlusIcon } from '@/components/icons';
import { useExperimentInteractive } from '@/components/experiment-interactive/ExperimentInteractive/hooks';

export default function ControlPanel() {
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
  const [_, setSlotSelectorVisible] = useSlotSelectorVisible();
  const addNewSimulation = () => {
    setSlotSelectorVisible(true);
  };
  const { showViewSettingsPanel } = useExperimentInteractive();

  return (
    <div className="w-9 h-32 flex-col justify-start items-start gap-1 inline-flex absolute right-0 top-0 m-3">
      <ControlPanelButton onClick={showViewSettingsPanel}>
        <EyeIcon />
      </ControlPanelButton>
      <ControlPanelButton onClick={addNewSimulation}>
        <PlusIcon />
      </ControlPanelButton>
    </div>
  );
}
