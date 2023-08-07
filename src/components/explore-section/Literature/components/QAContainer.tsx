'use client';

import React from 'react';
import QAChat from './QAChat';
import QALeftPanel from './QALeftPanel';

function QAContainer() {
  return (
    <div className="box-border relative flex w-full h-screen gap-x-5">
      <div className="flex-shrink-0 overflow-hidden overflow-x-hidden">
        <QALeftPanel />
      </div>
      <div className="flex flex-1 w-full h-full">
        <QAChat />
      </div>
    </div>
  );
}

export default QAContainer;
