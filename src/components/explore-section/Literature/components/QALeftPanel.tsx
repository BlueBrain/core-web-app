'use client';

import { useAtomValue } from 'jotai';

import QAHistoryNavigation from './QANavigation';
import { literatureResultAtom } from '@/state/literature';
import usePathname from '@/hooks/pathname';
import { classNames } from '@/util/utils';

function QALeftPanel() {
  const pathname = usePathname();
  const isBuildSection = pathname?.startsWith('/build');

  const QAs = useAtomValue(literatureResultAtom);
  if (QAs.length < 2) return null;

  return (
    <div
      className={classNames(
        'box-border h-screen overflow-auto',
        isBuildSection ? 'w-[290px]' : 'w-96 pr-4'
      )}
    >
      <QAHistoryNavigation />
    </div>
  );
}

export default QALeftPanel;
