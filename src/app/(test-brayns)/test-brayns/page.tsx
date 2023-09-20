'use client';

import BraynsSimulationViewer from '@/services/brayns/simulations/BraynsSimulationViewer';
import AxisGizmo from '@/components/InteractiveBrayns/AxisGizmo';
import { useMultiBraynsManager } from '@/services/brayns/simulations';

import styles from './page.module.css';

/**
 * We need to test the allocation of multiple instances of Brayns
 * in a real test environment before we can give the code to
 * the developper that will connect it with the actual UI.
 *
 * Once MultiBraynsManager is integrated with the actual UI,
 * we should delete this file (and its folder).
 */
export default function TestBraynsPage() {
  const manager = useMultiBraynsManager();
  return (
    <div className={styles.testBrayns}>
      <BraynsSimulationViewer slotId={0} />
      <BraynsSimulationViewer slotId={1} />
      <BraynsSimulationViewer slotId={2} />
      <BraynsSimulationViewer slotId={3} />
      {manager && <AxisGizmo camera={manager.camera} className={styles.axisGizmo} />}
    </div>
  );
}
