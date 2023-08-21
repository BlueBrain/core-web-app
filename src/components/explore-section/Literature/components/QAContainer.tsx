'use client';

import QAInteractive from './QAInteractive';
import QALeftPanel from './QALeftPanel';
import QASettingsPanel from './QASettingsPanel';
import { classNames } from '@/util/utils';
import usePathname from '@/hooks/pathname';

function QAContainer() {
  const pathname = usePathname();
  const isBuildSection = pathname?.startsWith('/build');

  return (
    <div
      className={classNames(
        'box-border relative flex w-full',
        isBuildSection ? 'h-[calc(100vh-40px)]' : 'h-screen'
      )}
    >
      <div className="flex-shrink-0 mr-5 overflow-hidden overflow-x-hidden">
        <QALeftPanel />
      </div>
      <div className="flex flex-1 w-full h-full">
        <QAInteractive />
      </div>
      <div>
        <QASettingsPanel />
      </div>
    </div>
  );
}

export default QAContainer;
