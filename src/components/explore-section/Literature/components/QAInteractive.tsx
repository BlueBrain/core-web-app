import { useRef } from 'react';

import QAResultList from './GenerativeQAResults';
import QAInput from './GenerativeQAInput';
import QAFilterPanel from './FilterPanel';

export default function QAChat() {
  const imperativeRef = useRef<{ goToBottom: () => void }>(null);
  const goToBottom = imperativeRef.current?.goToBottom;

  return (
    <div className="relative flex flex-col w-full overflow-hidden transition-all duration-300 ease-in-out max-w-ful">
      <main className="flex flex-col items-stretch flex-1 w-full h-full">
        <QAResultList imperativeRef={imperativeRef} />
        <QAInput goToBottom={goToBottom} />
        <QAFilterPanel />
      </main>
    </div>
  );
}
