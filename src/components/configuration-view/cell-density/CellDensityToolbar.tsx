import { Button } from 'antd';
import UndoIcon from '@/components/icons/UndoIcon';
import ResetIcon from '@/components/icons/ResetIcon';

import styles from './cell-density-toolbar.module.scss';

export default function CellDensityToolbar() {
  return (
    <div className={styles.cellDensityToolbar}>
      <Button type="text">Densities [mm³]</Button>
      <Button type="text" className="active">
        Percentage
      </Button>
      <div className={styles.spacer} />
      <Button type="text">
        <UndoIcon />
        Undo
      </Button>
      <Button type="text">
        <ResetIcon />
        Reset
      </Button>
    </div>
  );
}
