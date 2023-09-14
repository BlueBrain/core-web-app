'use client';

import BraynsSimulationViewer from '@/services/brayns/simulations/BraynsSimulationViewer';

import Style from './page.module.css';

/**
 * We need to test the allocation of multiple instances of Brayns
 * in a real test environment before we can give the code to
 * the developper that will connect it with the actual UI.
 *
 * Once MultiBraynsManager is integrated with the actual UI,
 * we should delete this file (and its folder).
 */
export default function TestBraynsPage() {
  return (
    <div className={Style.TestBrayns}>
      <BraynsSimulationViewer slotId={0} />
      <BraynsSimulationViewer slotId={1} />
      <BraynsSimulationViewer slotId={2} />
      <BraynsSimulationViewer slotId={3} />
    </div>
  );
}
