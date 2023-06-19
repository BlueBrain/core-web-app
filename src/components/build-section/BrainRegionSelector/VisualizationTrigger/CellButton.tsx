import Icon from '@ant-design/icons';
import { CellIcon } from './CellIcon';
import { useAtlasVisualizationManager } from '@/state/atlas';
import LoadingIcon from '@/components/icons/LoadingIcon';

interface CellButtonProps {
  regionID: string;
  /** Hexa color for the current region, as defined by Allen institute. */
  colorCode: string;
}

export default function CellButton({ regionID, colorCode }: CellButtonProps) {
  const atlas = useAtlasVisualizationManager();
  const cell = atlas.findVisibleCell(regionID);
  const selected = Boolean(cell);
  const handleClick = () => {
    if (cell) {
      atlas.removeVisibleCells(cell.regionID);
    } else {
      atlas.addVisibleObjects({
        type: 'cell',
        regionID,
        color: colorCode,
        isLoading: false,
        hasError: false,
      });
    }
  };
  if (cell && cell.isLoading) {
    return <Icon spin component={LoadingIcon} style={{ fontSize: '16px' }} />;
  }
  return <CellIcon selected={selected} onClick={handleClick} />;
}
