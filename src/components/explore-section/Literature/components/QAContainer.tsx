'use client';

import { useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import useContextualLiteratureContext from '../useContextualLiteratureContext';
import QAInteractive from './QAInteractive';
import QALeftPanel from './QALeftPanel';
import { contextualLiteratureResultAtom, literatureResultAtom } from '@/state/literature';
import { classNames } from '@/util/utils';

function QAContainer() {
  const firstRenderRef = useRef(true);
  const QAs = useAtomValue(literatureResultAtom);
  // imp!: use default setter instead of update due the inifine loop on useEffect
  // using the atom setter will not trigger the inifine re-render because it was safe-reference
  // if decide to use update funciton from costum atom hook, then you must remove it from useEffect dependencies
  const setContextualAtom = useSetAtom(contextualLiteratureResultAtom);
  const { selectedQuestion, isBuildSection } = useContextualLiteratureContext();

  useEffect(() => {
    const question = QAs.find((item) => item.id === selectedQuestion) ?? null;
    if (firstRenderRef.current && question) {
      setContextualAtom([question]);
      firstRenderRef.current = false;
    }
  }, [QAs, selectedQuestion, setContextualAtom]);

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
    </div>
  );
}

export default QAContainer;
