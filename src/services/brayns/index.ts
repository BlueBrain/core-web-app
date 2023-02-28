import React from 'react';
import Allocation from './allocation';
import BraynsService from './brayns-service/brayns-service';
import Events from './utils/events';
import { BraynsServiceInterface } from './types';
import { logError } from '@/util/logger';

export type { BraynsServiceInterface } from './types';

const EXPORTS = {
  /**
   * @param token Keycloak authentication token.
   * @returns A string if an error occured, `null` until the allocation is done.
   */
  useBrayns(token: string | undefined): null | BraynsServiceInterface | string {
    const [braynsService, setBraynsService] = React.useState<
      null | BraynsServiceInterface | string
    >(null);
    React.useEffect(() => {
      if (!token) return;

      Allocation.allocate(token)
        .then((wrapper) => {
          setBraynsService(new BraynsService(wrapper, token));
        })
        .catch((ex) => {
          logError('Unable to allocate a node for Brayns!', ex);
          setBraynsService(ex instanceof Error ? ex.message : JSON.stringify(ex));
        });
    }, [token]);
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
