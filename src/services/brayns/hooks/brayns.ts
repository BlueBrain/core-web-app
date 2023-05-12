/* eslint-disable import/prefer-default-export */
import React from 'react';
import CameraTransform from '../utils/camera-transform';
import Allocation from '../allocation';
import BraynsService from '../brayns-service';
import { BraynsServiceInterface } from '../types';
import useNotification from '@/hooks/notifications';
import { logError } from '@/util/logger';

/**
 * @param token Keycloak authentication token.
 * @returns A string if an error occured, `null` until the allocation is done.
 */
export function useBraynsService(
  token: string | undefined
): null | BraynsServiceInterface | string {
  const notif = useNotification();
  const [braynsService, setBraynsService] = React.useState<null | BraynsServiceInterface | string>(
    null
  );
  React.useEffect(() => {
    if (!token || braynsService) return;

    Allocation.allocate(token)
      .then((wrapper) => {
        setBraynsService(new BraynsService(wrapper, token));
        CameraTransform.reset();
      })
      .catch((ex) => {
        logError('Unable to allocate a node for Brayns!', ex);
        setBraynsService(ex instanceof Error ? ex.message : JSON.stringify(ex));
        notif.error('Unable to start Brayns in a node!');
      });
  }, [token, notif, braynsService]);
  return braynsService;
}
