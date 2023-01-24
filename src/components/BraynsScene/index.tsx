'use client';

import * as React from 'react';
import { BraynsSceneController, BraynsSceneProps } from './types';
import Controller from './controller';
import Persistence from './allocation-persistence';

const BCS_BASE_URL = 'http://s3.braynscircuitstudio.kcp.bbp.epfl.ch';

function makeURL(token: string, account: string): string {
  const base = `${BCS_BASE_URL}/?token=${token}&ui=off&`;
  const host = Persistence.getAllocatedHost();
  const url = host ? `${base}host=${host}` : `${base}account=${account}`;
  return url;
}

export default function BraynsScene({ className, account, token, onReady }: BraynsSceneProps) {
  const onController = React.useCallback(
    (controller: BraynsSceneController) => {
      onReady(controller);
    },
    [onReady]
  );
  return (
    <iframe
      className={className}
      title="Brayns Viewer"
      ref={(iframe) => Controller.startListening(iframe, onController)}
      src={makeURL(token, account)}
    />
  );
}
