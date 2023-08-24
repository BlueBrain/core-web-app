'use client';

import ControlPanelButton from './ControlPanelButton';
import { EyeIcon, PlusIcon } from '@/components/icons';
import EditPencilIcon from '@/components/icons/EditPencil';
import { useExperimentInteractive } from '@/components/experiment-interactive/ExperimentInteractive/hooks';

export default function ControlPanel() {
  const { addNewSimulation, startBulkEditing } = useExperimentInteractive();

  return (
    <div className="w-9 h-32 flex-col justify-start items-start gap-1 inline-flex absolute right-0 top-0 m-3">
      <ControlPanelButton>
        <EyeIcon />
      </ControlPanelButton>
      <ControlPanelButton onClick={startBulkEditing}>
        <EditPencilIcon />
      </ControlPanelButton>
      <ControlPanelButton onClick={addNewSimulation}>
        <PlusIcon />
      </ControlPanelButton>
    </div>
  );
}
