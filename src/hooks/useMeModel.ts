import { useEffect, useState } from 'react';
import { fetchResourceById } from '@/api/nexus';
import { getSession } from '@/authFetch';
import useNotification from '@/hooks/notifications';
import { ModelResource } from '@/types/simulate/single-neuron';

export function useMeModel({ modelId }: { modelId: string }) {
  const [resource, setResource] = useState<ModelResource | null>(null);
  const [loading, setLoading] = useState(false);
  const { error: notifyError } = useNotification();

  useEffect(() => {
    let isAborted = false;
    (async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) throw new Error('no session');
        const resourceObject = await fetchResourceById<ModelResource>(modelId, session);
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
