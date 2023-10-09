import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { from64 } from '@/util/common';

export function useCurrentCampaignId() {
  const [campaignId, setCampaignId] = useState<string | undefined>(undefined);
  const params = useParams();
  useEffect(() => {
    if (!params) {
      setCampaignId(undefined);
      return;
    }
    if (typeof params.id !== 'string') {
      setCampaignId(undefined);
      return;
    }
    const decodedId = from64(decodeURIComponent(params.id));

    // Format of the param is <ORG>/<PROJ>!/!<ID>
    const parts = decodedId.split('!/!');
    setCampaignId(parts.pop());
  }, [params]);
  return campaignId;
}

export function useAccessToken(): string | undefined {
  const { data: session } = useSession();
  return session?.accessToken;
}
