'use client';

import { useAtomValue } from 'jotai';

import QAHistoryNavigation from './QANavigation';
import { literatureResultAtom } from '@/state/literature';

function QALeftPanel() {
  const QAs = useAtomValue(literatureResultAtom);
  if (QAs.length < 2) return null;

  return (
    <div className="box-border h-screen pr-4 overflow-auto w-96">
      <QAHistoryNavigation />
    </div>
  );
}

export default QALeftPanel;
