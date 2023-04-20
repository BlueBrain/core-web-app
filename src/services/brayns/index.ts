'use client';

import React from 'react';

import useNotification from '../../hooks/notifications';
import Allocation from './allocation';
import BraynsService from './brayns-service/brayns-service';
import { BraynsServiceInterface } from './types';
import Events from './utils/events';
import { logError } from '@/util/logger';

export type { BraynsServiceInterface } from './types';

const EXPORTS = {
  /**
   * @param token Keycloak authentication token.
   * @returns A string if an error occured, `null` until the allocation is done.
   */
  useBrayns(token: string | undefined): null | BraynsServiceInterface | string {
    const notif = useNotification();
    const [braynsService, setBraynsService] = React.useState<
      null | BraynsServiceInterface | string
    >(null);
    React.useEffect(() => {
      if (!token || braynsService) return;

      Allocation.allocate(token)
        .then((wrapper) => {
          setBraynsService(new BraynsService(wrapper, token));
        })
        .catch((ex) => {
          logError('Unable to allocate a node for Brayns!', ex);
          setBraynsService(ex instanceof Error ? ex.message : JSON.stringify(ex));
          notif.error('Unable to start Brayns in a node!');
        });
    }, [token, notif, braynsService]);
    return braynsService;
  },

  /**
   * Changes everytime the allocation has stepped forward.
   */
  useAllocationProgress(): string {
    return Events.useEvent(Events.allocationProgress, 'Loading...');
  },
};

export default EXPORTS;
