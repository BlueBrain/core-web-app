import { ChangeEvent } from 'react';

import { SimulationCoord } from '../hooks/available-coords';
import { classNames } from '@/util/utils';

import styles from './coord-filter.module.css';

export interface CoordLabelProps {
  className?: string;
  coord: SimulationCoord;
  value: string;
  onChange(value: string | undefined): void;
}

export default function CoordFilter({ className, coord, value, onChange }: CoordLabelProps) {
  const handleSelectChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    onChange(evt.target.value || undefined);
  };
  return (
    <div className={classNames(styles.coordLabel, className)}>
      <div style={{ background: coord.color }} />
      <select
        value={value}
        onChange={handleSelectChange}
        className="border border-gray-400 bg-black text-white"
      >
        {['', ...coord.values.slice().sort((a, b) => a - b)].map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
}
