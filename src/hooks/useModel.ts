import { useEffect, useRef, useState } from 'react';
import { fetchResourceById } from '@/api/nexus';
import { getSession } from '@/authFetch';
import useNotification from '@/hooks/notifications';
import { nexus } from '@/config';

export function useModel<T>({
  modelId,
  org,
  project,
  callback,
}: {
  modelId: string;
  org?: string;
  project?: string;
  callback?: (value: T) => void;
}) {
  const [resource, setResource] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const { error: notifyError } = useNotification();
  const callbackRef = useRef(callback);

  useEffect(() => {
    let isAborted = false;
    (async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) throw new Error('no session');

        const resourceObject = await fetchResourceById<T>(modelId, session,
          modelId.startsWith(nexus.defaultIdBaseUrl) ? {} : {
            org,
            project,
          });
        if (!isAborted) {
          setResource(resourceObject);
          callbackRef.current?.(resourceObject);
        }
      } catch (error) {
        notifyError('Error while loading the resource details', undefined, 'topRight');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      isAborted = true;
    };
  }, [modelId, notifyError, org, project]);

  return { resource, loading };
}
