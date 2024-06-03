'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { signIn, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import sessionAtom from '@/state/session';

function SessionProvider() {
  let session: Session | null;
  return {
    getSession() {
      return session;
    },
    setSession(newSession: Session | null) {
      session = newSession;
    },
  };
}

const { getSession, setSession } = SessionProvider();
export { getSession, setSession };

export default function useSessionState() {
  const currentSession = useSession();
  const [session, setSessionState] = useAtom(sessionAtom);

  useEffect(() => {
    if (currentSession?.status === 'unauthenticated') {
      setSessionState(null);
      setSession(null);
      return;
    }

    if (
      currentSession?.status !== 'authenticated' ||
      currentSession.data.accessToken === session?.accessToken
    )
      return;

    if (!session) {
      setSessionState(currentSession.data);
    } else {
      // This is a workaround not to cause data re-fetch when updating access token.
      // TODO: design a proper solution.
      Object.assign(session as Session, currentSession.data);
    }
    setSession(currentSession.data);
  }, [session?.accessToken, currentSession, session, setSessionState]);

  useEffect(() => {
    if (session?.error !== 'RefreshAccessTokenError') return;

    // automatically signIn when a refresh token expires
    signIn('keycloak');
  }, [session]);
}
