'use client';

import { useAtomValue } from 'jotai';

import QAHistoryNavigation from './QANavigation';
import QABrainRegion from './QABrainRegion';
import { literatureResultAtom } from '@/state/literature';
import usePathname from '@/hooks/pathname';
import { classNames } from '@/util/utils';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

function QALeftPanel() {
  const pathname = usePathname();
  const isBuildSection = pathname?.startsWith('/build');
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const QAs = useAtomValue(literatureResultAtom);

  if (QAs.length < 2 && (!selectedBrainRegion?.id || !isBuildSection)) return null;

  return (
    <div
      className={classNames(
        'box-border h-screen overflow-hidden my-3',
        isBuildSection ? 'w-[290px]' : 'w-96 pr-4'
      )}
    >
      {isBuildSection && <QABrainRegion />}
      <QAHistoryNavigation />
    </div>
  );
}

export default QALeftPanel;
