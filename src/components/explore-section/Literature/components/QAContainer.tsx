'use client';

import QAInteractive from './QAInteractive';
import QALeftPanel from './QALeftPanel';
import { classNames } from '@/util/utils';
import usePathname from '@/hooks/pathname';

function QAContainer() {
  const pathname = usePathname();
  const isBuildSection = pathname?.startsWith('/build');
  return (
    <div
      className={classNames(
        'box-border relative flex w-full gap-x-5',
        isBuildSection ? 'h-[calc(100vh-40px)]' : 'h-screen'
      )}
    >
      <div className="flex-shrink-0 overflow-hidden overflow-x-hidden">
        <QALeftPanel />
      </div>
      <div className="flex flex-1 w-full h-full">
        <QAInteractive />
      </div>
    </div>
  );
}

export default QAContainer;
