import Button from '../ToolbarPanel/Button';
import { useSimulationPreview } from '../hooks';
import TrashIcon from '@/components/icons/Trash';

export default function Topic() {
  const { index, deleteCurrentSimulation } = useSimulationPreview();

  return (
    <div className="flex flex-row justify-between">
      <div className="font-bold text-white/50">{index}</div>
      <div>
        <Button onClick={deleteCurrentSimulation}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
}
