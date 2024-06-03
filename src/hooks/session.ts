'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { signIn, useSession, getSession as getSessionFromApi } from 'next-auth/react';
import { Session } from 'next-auth';
import sessionAtom from '@/state/session';

export type SessionOrNull = Session | null;

/* Calls /api/auth if no other caller has or waits the session
   Ensures  /api/auth is called at most once per page load 
   useSessionState updates it to keep the session 'fresh'.
*/
function SessionFromAPILock() {
  let session: SessionOrNull = null;
  let sessionPromise: Promise<SessionOrNull> | null = null;

  return {
    async getSession() {
      if (session) return session;

      if (!sessionPromise) {
        sessionPromise = getSessionFromApi();
      }

      session = await sessionPromise;
      return session;
    },
    setSession(newSession: SessionOrNull) {
      session = newSession;
    },
  };
}

const { getSession: getSessionLocked, setSession } = SessionFromAPILock();

export { getSessionLocked, setSession };

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
