import { SimulationCoord } from '../hooks/available-coords';
import { classNames } from '@/util/utils';

import styles from './coord-label.module.css';

export interface CoordLabelProps {
  className?: string;
  value: SimulationCoord;
}

export default function CoordLabel({ className, value }: CoordLabelProps) {
  console.log('🚀 [CoordLabel] value = ', value); // @FIXME: Remove this line written on 2023-10-04 at 16:49
  return (
    <div className={classNames(styles.coordLabel, className)}>
      <div style={{ background: value.color }} />
      <div>{value.name}</div>
    </div>
  );
}
