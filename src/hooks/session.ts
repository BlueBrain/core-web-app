'use client';

import { useEffect, useRef } from 'react';
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

const { getSession: getSessionLocked, setSession } = initClientSession();

export { getSessionLocked, setSession };

// Ensures a function is called just once during the component lifecycle and return the
// result like useMemo with no dependencies but guaranteed to never re-run
// See useMemo caveats: https://react.dev/reference/react/useMemo#caveats
function useOnce<T>(func: () => T): T | undefined {
  const executedRef = useRef(false);
  const resultRef = useRef<T>();

  if (!executedRef.current) {
    resultRef.current = func();
    executedRef.current = true;
  }

  return resultRef.current;
}

export default function useSessionState(initialSession: SessionOrNull) {
  const currentSession = useSession();
  const [session, setSessionState] = useAtom(sessionAtom);
  const previousSession = usePrevious(currentSession);

  useOnce(() => setSession(initialSession));

  // If user logs-out in another window refresh page, (middleware will redirect to login if in a secured page)
  if (currentSession?.status === 'unauthenticated' && previousSession?.status === 'authenticated') {
    window.location.reload();
  }

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
