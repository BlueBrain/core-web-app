'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { captureException } from '@sentry/nextjs';

import { processInvite } from './api';
import { getErrorUrl, getLabUrl, getProjectUrl } from './utils';
import sessionAtom from '@/state/session';
import { isVlmInviteResponse } from '@/types/virtual-lab/invites';

export default function InviteLoader() {
  const session = useAtomValue(sessionAtom);
  const inviteToken = useSearchParams().get('token');
  const router = useRouter();

  useEffect(() => {
    if (!session?.accessToken) {
      return router.push(getErrorUrl(null, session?.accessToken, inviteToken));
    }
    if (!inviteToken) {
      return router.push(getErrorUrl(null, session?.accessToken, inviteToken));
    }

    processInvite(session.accessToken, inviteToken).then((response) => {
      if (!isVlmInviteResponse(response)) {
        router.push(getErrorUrl(response, session?.accessToken, inviteToken));
        return;
      }

      switch (response.data.origin) {
        case 'Lab':
          router.push(getLabUrl(response.data));
          return;
        case 'Project':
          router.push(getProjectUrl(response.data));
          return;
        default:
          captureException(
            new Error(
              `User could not accept invite ${inviteToken} because unknown origin returned by server`
            ),
            { extra: response.data.origin }
          );
          router.push(getErrorUrl(response, session?.accessToken, inviteToken));
      }
    });
  }, [session, inviteToken, router]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-primary-8">
      <Spin indicator={<LoadingOutlined style={{ color: '#fff', fontSize: 24 }} spin />} />
    </div>
  );
}
