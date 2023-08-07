'use client';

import { useAtomValue } from 'jotai';
import { literatureAtom, literatureResultAtom } from '../state';
import QAHistoryNavigation from './QANavigation';
import DefaultBrainRegion from './QADefaultBrainRegion';

function QALeftPanel() {
  const { selectedBrainRegion } = useAtomValue(literatureAtom);
  const QAs = useAtomValue(literatureResultAtom);
  if (!selectedBrainRegion && QAs.length < 2) return null;
  return (
    <div className="box-border h-screen pr-4 overflow-auto no-scrollbar w-96">
      <DefaultBrainRegion />
      <QAHistoryNavigation />
    </div>
  );
}

export default QALeftPanel;
