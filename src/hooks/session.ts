'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { signIn, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import sessionAtom from '@/state/session';

export default function useSessionState() {
  const currentSession = useSession();
  const [session, setSession] = useAtom(sessionAtom);

  useEffect(() => {
    if (currentSession?.status === 'unauthenticated') {
      setSession(null);
      return;
    }

    if (
      currentSession?.status !== 'authenticated' ||
      currentSession.data.accessToken === session?.accessToken
    )
      return;

    if (!session) {
      setSession(currentSession.data);
    } else {
      // This is a workaround not to cause data re-fetch when updating access token.
      // TODO: design a proper solution.
      Object.assign(session as Session, currentSession.data);
    }
  }, [session?.accessToken, currentSession, setSession, session]);

  useEffect(() => {
    if (session?.error !== 'RefreshAccessTokenError') return;

    // automatically signIn when a refresh token expires
    signIn('keycloak');
  }, [session]);
}
