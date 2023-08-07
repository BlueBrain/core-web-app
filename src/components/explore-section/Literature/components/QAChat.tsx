import React from 'react';
import QAResultList from './QAResults';
import QAInput from './QAInput';
import QAFilterPanel from './QAFilterPanel';

export default function QAChat() {
  return (
    <div className="relative flex flex-col w-full overflow-hidden transition-all duration-300 ease-in-out max-w-ful">
      <main className="flex flex-col items-stretch flex-1 w-full h-full">
        <QAResultList />
        <QAInput />
        <QAFilterPanel />
      </main>
    </div>
  );
}
