import { useEffect, useState } from 'react';

import Allocation from '@brayns/../circuit/allocation';
import BraynsService from '@brayns/../circuit/brayns-service';
import CameraTransform from '@brayns/utils/camera-transform';
import { BraynsServiceInterface } from '@brayns/types';
import useNotification from '@/hooks/notifications';
import { logError } from '@/util/logger';
import { useAtlasVisualizationManager } from '@/state/atlas';

/**
 * @param token Keycloak authentication token.
 * @returns A string if an error occured, `null` until the allocation is done.
 */
export function useBraynsService(
  token: string | undefined
): null | BraynsServiceInterface | string {
  const atlas = useAtlasVisualizationManager();
  const notif = useNotification();
  const [braynsService, setBraynsService] = useState<null | BraynsServiceInterface | string>(null);
  useEffect(() => {
    if (!token || braynsService) return;

    Allocation.allocate(token)
      .then((wrapper) => {
        setBraynsService(new BraynsService(wrapper, token, atlas));
        CameraTransform.reset();
      })
      .catch((ex) => {
        logError('Unable to allocate a node for Brayns!', ex);
        setBraynsService(ex instanceof Error ? ex.message : JSON.stringify(ex));
        notif.error('Unable to start Brayns in a node!');
      });
  }, [token, notif, braynsService, atlas]);
  return braynsService;
}
