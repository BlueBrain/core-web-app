'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function useEnsureLogin() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session && status === 'unauthenticated') {
      // automatically re-login when in a sub-route
      signIn('keycloak');
    }
    if (session?.error === 'RefreshAccessTokenError') {
      // automatically re-login if refresh token expires
      signIn('keycloak');
    }
  }, [session]);
}
