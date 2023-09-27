'use client';

import ControlPanelButton from './ControlPanelButton';
import { EyeIcon, PlusIcon } from '@/components/icons';
import EditPencilIcon from '@/components/icons/EditPencil';
import {
  useExperimentInteractive,
  useSimulationSlots,
} from '@/components/experiment-interactive/ExperimentInteractive/hooks';

export default function ControlPanel() {
  const simulationSlots = useSimulationSlots();
  const addNewSimulation = () => {
    simulationSlots.add({
      circuitPath:
        '/gpfs/bbp.cscs.ch/data/scratch/proj134/home/king/BBPP134-479_custom/full_shm800.b/simulation_config.json',
      populationName: 'root__neurons',
      report: { name: 'soma', type: 'compartment' },
    });
  };
  const { /* addNewSimulation, */ startBulkEditing, showViewSettingsPanel } =
    useExperimentInteractive();

  return (
    <div className="w-9 h-32 flex-col justify-start items-start gap-1 inline-flex absolute right-0 top-0 m-3">
      <ControlPanelButton onClick={showViewSettingsPanel}>
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
