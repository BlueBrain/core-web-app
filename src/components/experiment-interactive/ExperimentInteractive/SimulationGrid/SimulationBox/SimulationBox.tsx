import { useEffect } from 'react';
import { DeleteFilled } from '@ant-design/icons';

import { SimulationSlot } from '../../hooks';
import CoordValue from '../../CoordValue';
import { useAvailableCoords } from '../../hooks/available-coords';
import { useSimulations } from '../../hooks/simulations/simulations';
import { useCurrentCampaignDescriptor } from '../../hooks/current-campaign-descriptor';
import { classNames } from '@/util/utils';
import BraynsSimulationViewer from '@/services/brayns/simulations/BraynsSimulationViewer';
import { useMultiBraynsManager } from '@/services/brayns/simulations';

import styles from './simulation-box.module.css';

interface SimulationBoxProps {
  className?: string;
  value: SimulationSlot;
  onDelete(value: SimulationSlot): void;
}

export default function SimulationBox({ className, value, onDelete }: SimulationBoxProps) {
  const manager = useMultiBraynsManager();
  const colors = useColorsPerCoord();
  useEffect(() => {
    manager?.loadSimulation(value);
  }, [manager, value]);
  return (
    <div className={classNames(styles.main, className)}>
      <BraynsSimulationViewer className={styles.fullsize} slot={value} />
      <div className={styles.coords}>
        {Object.keys(value.coords).map((name) => (
          <CoordValue
            key={name}
            name={name}
            value={value.coords[name]}
            color={colors.get(name) ?? '#000'}
          />
        ))}
      </div>
      <button
        type="button"
        className={`${styles.button} w-9 h-9 bg-black rounded-lg border border-neutral-400 justify-center items-center gap-2.5 inline-flex flex-row items-center`}
        onClick={() => onDelete(value)}
        aria-label="Delete"
      >
        <DeleteFilled />
      </button>
    </div>
  );
}

/**
 * @returns A map that gives the color for a coord's name.
 */
function useColorsPerCoord() {
  const colors = new Map<string, string>();
  const campaign = useCurrentCampaignDescriptor();
  const simulations = useSimulations(campaign);
  const coords = useAvailableCoords(simulations);
  coords.forEach((coord) => colors.set(coord.name, coord.color));
  return colors;
}
