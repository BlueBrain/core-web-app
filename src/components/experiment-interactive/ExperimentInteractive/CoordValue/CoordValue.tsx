import { classNames } from '@/util/utils';

import styles from './coord-value.module.css';

export interface CoordValueProps {
  className?: string;
  name: string;
  color: string;
  value: number;
}

export default function CoordValue({ className, name, color, value }: CoordValueProps) {
  return (
    <div className={classNames(styles.coordValue, className)} title={name}>
      <div style={{ background: color }} />
      <div className={styles.name}>{name}</div>
      <b>{value}</b>
    </div>
  );
}
