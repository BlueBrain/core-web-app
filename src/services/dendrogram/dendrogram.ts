import { useEffect, useState } from 'react';

import { blueNaasUrl } from '@/config';
import { useSessionAtomValue } from '@/hooks/hooks';
import useNotification from '@/hooks/notifications';
import { assertType } from '@/util/type-guards';
import { createHeaders } from '@/util/utils';

export interface DendrogramSegment {
  length: number;
  diam: number;
}

export type Dendrogram = {
  name: string;
  width: number;
  height: number;
  total_width: number;
  segments: DendrogramSegment[];
  sections: Dendrogram[];
};

/**
 * Fetch a dendrogram from BlueNaas.
 *
 * A dendrogram is a flat and hierarchical representation of a morphology.
 */
export function useDendrogram(modelId: string) {
  const [dendrogram, setDendrogram] = useState<Dendrogram | null>(null);
  const session = useSessionAtomValue();
  const notify = useNotification();

  useEffect(() => {
    setDendrogram(null);
    const token = session?.accessToken;
    if (token) {
      fetchDendrogram(modelId, token)
        .then(setDendrogram)
        .catch((ex) => {
          setDendrogram(null);
          notify.error(ex);
        });
    }
  }, [session, modelId, notify]);

  return dendrogram;
}

async function fetchDendrogram(modelId: string, token: string) {
  const response = await fetch(
    `${blueNaasUrl}/morphology/dendrogram?model_id=${encodeURIComponent(modelId)}`,
    {
      method: 'get',
      headers: createHeaders(token, {
        accept: 'application/x-ndjson',
      }),
    }
  );
  const data = await response.json();
  assertType<Dendrogram>(data, {
    name: 'string',
    width: 'number',
    height: 'number',
    total_width: 'number',
    segments: [
      'array',
      {
        length: 'number',
        diam: 'number',
      },
    ],
    sections: ['array', 'unknown'],
  });
  return data;
}
