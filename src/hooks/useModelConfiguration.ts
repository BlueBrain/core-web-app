import { useEffect, useRef, useState } from 'react';
import { fetchJsonFileByUrl } from '@/api/nexus';
import { getSession } from '@/authFetch';
import useNotification from '@/hooks/notifications';

export function useModelConfiguration<T>({
  contentUrl,
  callback,
}: {
  contentUrl?: string;
  callback?: (config: T) => void;
}) {
  const [configuration, setConfiguration] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const { error: notifyError } = useNotification();
  const callbackRef = useRef(callback);

  useEffect(() => {
    let isAborted = false;

    async function fetchConfiguration() {
      if (!contentUrl) return;
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) throw new Error('no session');
        const config = await fetchJsonFileByUrl<T>(contentUrl, session);
        if (!isAborted) {
          setConfiguration(config);
          callbackRef.current?.(config);
        }
      } catch (error) {
        notifyError('Error while loading the resource details', undefined, 'topRight');
      } finally {
        setLoading(false);
      }
    }

    fetchConfiguration();

    return () => {
      isAborted = true;
    };
  }, [contentUrl, notifyError]);

  return { loading, configuration };
}
