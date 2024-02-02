'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

import QAInteractive from './QAInteractive';
import QALeftPanel from './QALeftPanel';
import { classNames } from '@/util/utils';
import usePathname from '@/hooks/pathname';
import { initialParameters, literatureAtom, questionsParametersAtom } from '@/state/literature';

function QAContainer() {
  const pathname = usePathname();
  const isBuildSection = pathname?.startsWith('/build');
  const resetParameters = useSetAtom(questionsParametersAtom);
  const updateLiterature = useSetAtom(literatureAtom);

  useEffect(() => {
    return () => {
      resetParameters(initialParameters);
      updateLiterature((prev) => ({ ...prev, areQAParamsVisible: false }));
    };
  }, [resetParameters, updateLiterature]);

  return (
    <div
      className={classNames(
        'relative box-border flex w-full',
        isBuildSection ? 'h-[calc(100vh-40px)]' : 'h-screen'
      )}
    >
      <div className="mr-5 flex-shrink-0 overflow-hidden overflow-x-hidden">
        <QALeftPanel />
      </div>
      <div className="flex h-full w-full flex-1">
        <QAInteractive />
      </div>
    </div>
  );
}

export default QAContainer;
