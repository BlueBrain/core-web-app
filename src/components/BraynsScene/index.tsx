'use client';

import * as React from 'react';
import { BraynsSceneController, BraynsSceneProps } from './types';
import Controller from './controller';
import Persistence from './allocation-persistence';

/**
 * This URL is hardcoded for now, because we are still testing
 * the concept.
 */
const BCS_BASE_URL = 'http://s3.braynscircuitstudio.kcp.bbp.epfl.ch';

function makeURL(token: string, account: string): string {
  const base = `${BCS_BASE_URL}/?token=${token}&ui=off&`;
  const host = Persistence.getAllocatedHost();
  const url = host ? `${base}host=${host}` : `${base}account=${account}`;
  return url;
}

export default function BraynsScene({ className, account, token, onReady }: BraynsSceneProps) {
  const [iframe, setIframe] = React.useState<null | HTMLIFrameElement>(null);
  const onController = React.useCallback(
    (controller: BraynsSceneController) => {
      onReady(controller);
    },
    [onReady]
  );
  React.useEffect(() => {
    Controller.startListening(iframe, onController);
    return () => {
      Controller.stopListening(iframe);
    };
  }, [iframe, onController]);
  return (
    <iframe
      className={className}
      title="Brayns Viewer"
      ref={setIframe}
      src={makeURL(token, account)}
    />
  );
}
