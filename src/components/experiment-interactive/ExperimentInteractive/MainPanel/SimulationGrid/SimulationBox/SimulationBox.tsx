import { useEffect } from 'react';
import { DeleteFilled } from '@ant-design/icons';

import { SimulationSlot } from '../../../hooks';
import { classNames } from '@/util/utils';
import BraynsSimulationViewer from '@/services/brayns/simulations/BraynsSimulationViewer';
import { useMultiBraynsManager } from '@/services/brayns/simulations';

import styles from './simulation-box.module.css';

interface SimulationBoxProps {
  className?: string;
  value: SimulationSlot;
  onDelete(slotId: number): void;
}

export default function SimulationBox({ className, value, onDelete }: SimulationBoxProps) {
  const manager = useMultiBraynsManager();
  useEffect(() => {
    manager?.loadSimulation(value.slotId, {
      circuitPath: value.circuitPath,
      populationName: value.populationName,
      report: value.report,
    });
  }, [manager, value.circuitPath, value.populationName, value.report, value.slotId]);
  return (
    <div className={classNames(styles.main, className)}>
      <BraynsSimulationViewer className={styles.fullsize} slotId={value.slotId} />
      <button
        type="button"
        className={`${styles.button} w-9 h-9 bg-black rounded-lg border border-neutral-400 justify-center items-center gap-2.5 inline-flex flex-row items-center`}
        onClick={() => onDelete(value.slotId)}
      >
        <DeleteFilled />
      </button>
    </div>
  );
}
