'use client';

import { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

/**
 * Provides necessary logic to handle auth session:
 * - Token auto refresh.
 * - SignIn redirect when the auth is required.
 * - SignOut when the refresh token expires.
 *
 * @param {boolean} required - force signIn if user isn't authenticated.
 */
export default function useAuth(required = false) {
  const { data: session } = useSession({
    required,
    onUnauthenticated() {
      // this is executed only if `required` is set to true
      signIn('keycloak');
    },
  });

  useEffect(() => {
    if (session?.error !== 'RefreshAccessTokenError') return;

    // automatically signIn/signOut when a refresh token expires
    if (required) {
      signIn('keycloak');
    } else {
      signOut();
    }
  }, [session, required]);
}
