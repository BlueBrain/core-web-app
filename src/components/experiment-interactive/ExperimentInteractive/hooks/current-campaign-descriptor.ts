import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { from64 } from '@/util/common';

export interface CampaignDescriptor {
  id: string;
  organization: string;
  project: string;
}

export function useCurrentCampaignDescriptor(): CampaignDescriptor | undefined {
  const [campaign, setCampaign] = useState<CampaignDescriptor | undefined>(undefined);
  const params = useParams();
  const paramId = params?.id;
  useEffect(() => {
    if (typeof paramId !== 'string') {
      setCampaign(undefined);
      return;
    }
    const decodedId = from64(decodeURIComponent(paramId));
    // Format of the param is <ORG>/<PROJ>!/!<ID>
    const [parts, id] = decodedId.split('!/!');
    const [organization, project] = parts.split('/');
    setCampaign({ id, organization, project });
  }, [paramId]);
  return campaign;
}

export function useAccessToken(): string | undefined {
  const { data: session } = useSession();
  return session?.accessToken;
}
