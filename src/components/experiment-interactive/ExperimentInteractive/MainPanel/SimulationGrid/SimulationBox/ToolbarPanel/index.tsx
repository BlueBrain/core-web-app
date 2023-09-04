import Button from './Button';
import EditPencilIcon from '@/components/icons/EditPencil';
import TrashIcon from '@/components/icons/Trash';
import { ZoomInIcon, ZoomOutIcon } from '@/components/icons';
import { useSimulationPreview } from '@/components/experiment-interactive/ExperimentInteractive/MainPanel/SimulationGrid/SimulationBox/hooks';

export function ToolbarPanel() {
  const { startEditing, deleteCurrentSimulation } = useSimulationPreview();

  return (
    <div className="absolute right-0 bottom-0 p-3 flex flex-col items-end gap-3 text-white/80 edit-panel">
      <div className="flex flex-col items-center">
        <Button borderless>
          <ZoomInIcon />
        </Button>
        <div className="text-center w-[1px] bg-white h-3" />
        <Button borderless>
          <ZoomOutIcon />
        </Button>
      </div>

      <div className="flex flex-row gap-1.5">
        <Button onClick={startEditing}>
          <EditPencilIcon />
        </Button>

        <Button onClick={deleteCurrentSimulation}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
}
