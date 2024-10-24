'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { signIn, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { usePrevious } from './hooks';
import sessionAtom from '@/state/session';

export type SessionOrNull = Session | null;

/* 
   Waits for useSessionState to set the session.
   useSessionState updates it to always have the latest token available.
*/
function initClientSession() {
  let sessionSet = false;
  let session: SessionOrNull = null;
  let resolvePromise: ((value: true) => void) | null = null;
  const sessionPromise = new Promise((r) => {
    resolvePromise = r;
  });

  return {
    async getSession() {
      if (session || sessionSet) return session;
      await sessionPromise;
      return session;
    },
    setSession(newSession: SessionOrNull) {
      session = newSession;
      sessionSet = true;
      if (resolvePromise) resolvePromise(true);
    },
  };
}

const { getSession: getClientSession, setSession } = initClientSession();

export { getClientSession, setSession };

export default function useSessionState() {
  const currentSession = useSession();
  const [session, setSessionState] = useAtom(sessionAtom);
  const previousSession = usePrevious(currentSession);

  setSession(currentSession?.data);

  // If user logs-out in another window refresh page, (middleware will redirect to login if in a secured page)
  if (currentSession?.status === 'unauthenticated' && previousSession?.status === 'authenticated') {
    window.location.reload();
  }

  useEffect(() => {
    if (currentSession?.status === 'unauthenticated') {
      setSessionState(null);
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
  }, [session?.accessToken, currentSession, session, setSessionState]);

  useEffect(() => {
    if (session?.error !== 'RefreshAccessTokenError') return;

    // automatically signIn when a refresh token expires
    signIn('keycloak');
  }, [session]);
}
