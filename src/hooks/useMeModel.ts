import { useEffect, useState } from 'react';
import { fetchResourceById } from '@/api/nexus';
import { getSession } from '@/authFetch';
import { MEModelResource } from '@/types/me-model';
import useNotification from '@/hooks/notifications';

export function useModel({
  modelId,
  org,
  project,
}: {
  modelId: string;
  org?: string;
  project?: string;
}) {
  const [resource, setResource] = useState<MEModelResource | null>(null);
  const [loading, setLoading] = useState(false);
  const { error: notifyError } = useNotification();

  useEffect(() => {
    let isAborted = false;
    (async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) throw new Error('no session');
        const resourceObject = await fetchResourceById<MEModelResource>(modelId, session, {
          org,
          project,
        });
        if (!isAborted) {
          setResource(resourceObject);
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
  }, [modelId, notifyError]);

  return { resource, loading };
}
