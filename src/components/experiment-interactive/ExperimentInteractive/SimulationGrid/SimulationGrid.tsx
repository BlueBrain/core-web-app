'use client';

import { useSimulationSlots } from '../hooks';
import SimulationBox from './SimulationBox';
import { classNames } from '@/util/utils';

import styles from './simulation-grid.module.css';

export default function SimulationGrid() {
  const simulationSlots = useSimulationSlots();
  return (
    <div
      className={classNames(
        styles.simulationGrid,
        styles[`template-${simulationSlots.list.length}`],
        'flex-grow flex flex-row relative w-full'
      )}
    >
      {simulationSlots.list.map((value, index) => (
        <div
          key={value.slotId}
          style={{
            gridArea: 'abcdefghi'.charAt(index),
          }}
        >
          <SimulationBox value={value} onDelete={simulationSlots.remove} />
        </div>
      ))}
    </div>
  );
}
