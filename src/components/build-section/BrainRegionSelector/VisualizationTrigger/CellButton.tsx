import ToggleButton from './ToggleButton';
import { useAtlasVisualizationManager } from '@/state/atlas';

interface CellButtonProps {
  regionID: string;
  /** Hexa color for the current region, as defined by Allen institute. */
  colorCode: string;
}

/**
 * This selectable button is used to show/hide morphologies for regions.
 */
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
  return (
    <ToggleButton busy={Boolean(cell?.isLoading)} selected={selected} onClick={handleClick}>
      <svg
        className="cursor-pointer"
        viewBox="0 0 13 12"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: '1.5em' }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.34124 1.43977e-08V4.28196H6.01186V0L6.34124 1.43977e-08Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.11855 9.69433L0.165966 12L0 11.7155L3.95258 9.40982L4.11855 9.69433Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.3531 11.7155L8.40051 9.40981L8.23454 9.69433L12.1871 12L12.3531 11.7155Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.17655 10.2108C7.72281 10.2108 8.9763 8.95735 8.9763 7.41109C8.9763 5.86483 7.72281 4.61134 6.17655 4.61134C4.63029 4.61134 3.37681 5.86483 3.37681 7.41109C3.37681 8.95735 4.63029 10.2108 6.17655 10.2108ZM6.17655 10.5402C7.90472 10.5402 9.30568 9.13926 9.30568 7.41109C9.30568 5.68292 7.90472 4.28196 6.17655 4.28196C4.44838 4.28196 3.04742 5.68292 3.04742 7.41109C3.04742 9.13926 4.44838 10.5402 6.17655 10.5402Z"
        />
        <path d="M7.65877 7.41109C7.65877 8.2297 6.99516 8.89331 6.17655 8.89331C5.35794 8.89331 4.69433 8.2297 4.69433 7.41109C4.69433 6.59248 5.35794 5.92887 6.17655 5.92887C6.99516 5.92887 7.65877 6.59248 7.65877 7.41109Z" />
      </svg>
    </ToggleButton>
  );
}
