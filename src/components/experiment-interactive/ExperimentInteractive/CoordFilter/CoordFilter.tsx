import { ChangeEvent } from 'react';

import { SimulationCoord } from '../hooks/available-coords';
import { classNames } from '@/util/utils';

import styles from './coord-filter.module.css';

export interface CoordLabelProps {
  className?: string;
  coord: SimulationCoord;
  value: string;
  onChange(value: string): void;
}

export default function CoordFilter({ className, coord, value, onChange }: CoordLabelProps) {
  const handleSelectChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    onChange(evt.target.value);
  };
  return (
    <div className={classNames(styles.coordLabel, className)}>
      <div style={{ background: coord.color }} />
      <select value={value} onChange={handleSelectChange}>
        {['', ...coord.values].map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
}
